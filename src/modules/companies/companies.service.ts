import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CompanyStatusType, RoleType, UserStatusType } from '@prisma/client';
import { PrismaService, PaginationDto, BucketsService } from '@App/shared';
import {
  CreateCompanyDto,
  CreateCompanyUserDto,
  FindCompanyDto,
  FindCompanyResultDto,
  FindCompanyUserDto,
  UpdateCompanyDto,
  UpdateCompanyUserDto,
} from './dtos';
import { CompanyEntity, CompanyUserEntity } from './entities';
import { randomUUID } from 'crypto';
import * as Slug from 'slug';
import { FindCompanyUserResultDto } from './dtos/company-users/find-company-user-result.dto';

@Injectable()
export class CompaniesService {
  private readonly bucketName = 'companies';

  constructor(
    private readonly bucketService: BucketsService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    const { companyName, email, userFirstName, userLastName } =
      createCompanyDto;

    const company = await this.prismaService.$transaction(async (prisma) => {
      const existing: any = await prisma.company.findFirst({
        where: { email },
      });

      if (existing) {
        throw new HttpException(
          'O email já se encontra em uso.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const tenantId = await this.getTenantId(companyName, prisma);
      const company = await prisma.company.create({
        data: {
          name: companyName,
          email,
          categories: [{ label: 'Geral', value: randomUUID() }],
          status: CompanyStatusType.ACTIVE,
          tenantId,
        },
      });

      await prisma.user.create({
        data: {
          companyId: company.id,
          firstName: userFirstName,
          lastName: userLastName,
          email,
          role: RoleType.OWNER,
          status: UserStatusType.ACTIVE,
        },
      });

      return company;
    });

    return new CompanyEntity(company);
  }

  async update(updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity> {
    const { id, ...updateData } = updateCompanyDto;

    let company = await this.prismaService.company.findFirst({
      where: { id },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    company = await this.prismaService.$transaction(async (prisma) => {
      if (updateData.logo && updateData.logo.indexOf('data:image') === 0) {
        await this.bucketService.uploadImage(
          this.bucketName,
          id,
          updateData.logo,
        );

        updateData.logo = this.bucketService.getImageUrl(this.bucketName, id);
      }

      return await prisma.company.update({
        where: { id },
        data: updateData as any,
      });
    });

    return new CompanyEntity(company);
  }

  async get(id: string): Promise<CompanyEntity> {
    const company = await this.prismaService.company.findFirst({
      where: { id, deletedAt: null },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return new CompanyEntity(company);
  }

  async find(findCompanyDto: FindCompanyDto): Promise<FindCompanyResultDto> {
    const where: any = {};
    const paginationData = FindCompanyDto.getPaginationParams(
      FindCompanyDto as PaginationDto,
    );

    if (findCompanyDto.name) {
      where.tenantId = { startsWith: Slug(findCompanyDto.name) };
    }

    if (findCompanyDto.address) {
      where.address = {
        startsWith: findCompanyDto.address,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.neighborhood) {
      where.neighborhood = {
        startsWith: findCompanyDto.neighborhood,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.city) {
      where.city = {
        startsWith: findCompanyDto.city,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.state) {
      where.state = {
        startsWith: findCompanyDto.state,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.status) {
      where.status = findCompanyDto.status;
    }

    const total = await this.prismaService.company.count({ where });

    const companies = await this.prismaService.company.findMany({
      where,
      skip: paginationData.skip,
      take: paginationData.limit,
    });

    return {
      page: paginationData.page,
      limit: paginationData.limit,
      total,
      data: companies.map((c: any) => new CompanyEntity(c)) || [],
    };
  }

  async getTenantId(label: string, prismaHandler?: any): Promise<string> {
    const prisma = prismaHandler || this.prismaService;
    const slug = Slug(label);

    const company = await prisma.company.findFirst({
      where: { tenantId: slug },
    });

    if (!company) {
      return slug;
    }

    const raw: any = await prisma.$queryRaw`
      select tenant_id
      from companies
      where tenant_id ~ '^${slug}[0-9]+$' order by id desc limit 1;
    `;

    if (!raw || raw.length === 0) {
      return `${slug}1`;
    }

    const last: number = Number(raw[0].slug.replace(slug, ''));
    return `${slug}${last + 1}`;
  }

  async getUser(companyId: string, userId: string): Promise<CompanyUserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId, companyId },
    });
    if (!user) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    return new CompanyUserEntity(user);
  }

  async findUser(
    companyId: string,
    findCompanyUserDto: FindCompanyUserDto,
  ): Promise<FindCompanyUserResultDto> {
    const { name, ...rest } = findCompanyUserDto;
    const where: any = { ...rest, companyId };

    if (name) {
      where.slug = { startsWith: Slug(name) };
    }

    const paginationData = FindCompanyUserDto.getPaginationParams(
      findCompanyUserDto as PaginationDto,
    );

    const total = await this.prismaService.user.count({ where });

    const users = await this.prismaService.user.findMany({
      where,
      skip: paginationData.skip,
      take: paginationData.limit,
    });

    return {
      page: paginationData.page,
      limit: paginationData.limit,
      total,
      data: users.map((c: any) => new CompanyUserEntity(c)) || [],
    };
  }

  async createUser(
    companyId: string,
    createCompanyUserDto: CreateCompanyUserDto,
  ): Promise<CompanyUserEntity> {
    const company = await this.prismaService.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new HttpException('Empresa inválida', HttpStatus.BAD_REQUEST);
    }

    const existing = this.prismaService.user.findUnique({
      where: { email: createCompanyUserDto.email },
    });

    if (!!existing) {
      throw new HttpException(
        'O email já se encontra em uso.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = await this.prismaService.user.create({
      data: createCompanyUserDto as any,
    });

    return new CompanyUserEntity(newUser);
  }

  async updateUser(
    companyId: string,
    updateCompanyUserDto: UpdateCompanyUserDto,
  ): Promise<CompanyUserEntity> {
    const { id, email } = updateCompanyUserDto;
    const updateData: any = { ...updateCompanyUserDto };

    let user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    if (user.companyId !== companyId) {
      throw new HttpException(
        'O usuário não pertence a empresa informada.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (email) {
      const existingEmail = this.prismaService.user.count({
        where: { id: { not: id }, email },
      });

      if (!!existingEmail) {
        throw new HttpException(
          'O email já se encontra em uso.',
          HttpStatus.BAD_REQUEST,
        );
      }

      updateData.email = email;
    }

    user = await this.prismaService.user.update({
      where: { id },
      data: updateData,
    });

    return new CompanyUserEntity(user);
  }

  async deleteUser(companyId: string, userId: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    if (user.companyId !== companyId) {
      throw new HttpException(
        'O usuário não pertence a empresa informada.',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
