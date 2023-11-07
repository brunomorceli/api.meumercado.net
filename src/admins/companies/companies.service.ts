import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CompanyStatusType, RoleType, UserStatusType } from '@prisma/client';
import { PrismaService, PaginationDto, BucketsService } from '@App/shared';
import { CompanyEntity } from './entities';
import { randomUUID } from 'crypto';
import * as Slug from 'slug';
import {
  CreateCompanyDto,
  FindCompanyDto,
  FindCompanyResultDto,
  UpdateCompanyDto,
} from './dtos';

@Injectable()
export class CompaniesService {
  private readonly bucketName = 'companies';

  constructor(
    private readonly bucketService: BucketsService,
    private readonly prismaService: PrismaService,
  ) {}

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

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    const { companyName, email, userName } = createCompanyDto;

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
          theme: {
            primaryColor: '#03a9f4',
            highlightColor: '#42a5f5',
            secondaryColor: '#eb2f96',
            backgroundColor: '#e0e0e0',
            textColor: '#434343',
            headerTextColor: '#ffffff',
            panelBackgroundColor: '#ffffff',
            panelTextColor: '#434343',
            titleTextColor: '#434343',
          },
        },
      });

      await prisma.user.create({
        data: {
          companyId: company.id,
          name: userName,
          slug: Slug(userName),
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

      if (updateData.covers) {
        for (let i = 0; i < updateData.covers.length; i++) {
          if (updateData.covers[i].indexOf('data:image') !== 0) {
            continue;
          }

          const imageName = `${company.id}_${randomUUID()}`;
          await this.bucketService.uploadImage(
            this.bucketName,
            imageName,
            updateData.covers[i],
          );

          updateData.covers[i] = this.bucketService.getImageUrl(
            this.bucketName,
            imageName,
          );
        }
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
    const where: any = { deletedAt: null };
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
}
