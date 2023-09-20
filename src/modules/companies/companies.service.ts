import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CompanyStatusType, User } from '@prisma/client';
import { PrismaService, PaginationDto, BucketsService } from '@App/shared';
import {
  CreateCompanyDto,
  FindCompanyDto,
  FindCompanyResultDto,
  UpdateCompanyDto,
} from './dtos';
import { CompanyEntity } from './entities';
import { randomUUID } from 'crypto';
import * as Slug from 'slug';

@Injectable()
export class CompaniesService {
  private readonly bucketName = 'companies';

  constructor(
    private readonly bucketService: BucketsService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    prismaHandler?: any,
  ): Promise<CompanyEntity> {
    const prisma = prismaHandler || this.prismaService;
    const { email, label } = createCompanyDto;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    const tenantId = await this.getTenantId(label, prisma);

    const creatingData: any = {
      id: randomUUID(),
      ownerId: user.id,
      label,
      slug: Slug(label),
      tenantId,
      categories: [{ label: 'Geral', value: randomUUID() }],
      roles: [
        {
          id: randomUUID(),
          label: 'Proprietário',
          permissions: {
            roles: ['edit', 'view', 'delete'],
            companies: ['edit', 'view', 'delete'],
            orders: ['edit', 'view', 'delete'],
            products: ['edit', 'view', 'delete'],
            employees: ['edit', 'view', 'delete'],
            clients: ['edit', 'view', 'delete'],
          },
        },
        {
          id: randomUUID(),
          label: 'Admin',
          permissions: {
            roles: ['edit', 'view'],
            companies: ['edit', 'view'],
            orders: ['edit', 'view', 'delete'],
            products: ['edit', 'view', 'delete'],
            employees: ['edit', 'view', 'delete'],
            clients: ['edit', 'view', 'delete'],
          },
        },
        {
          id: randomUUID(),
          label: 'Entregador',
          permissions: {
            roles: [],
            companies: ['view'],
            orders: ['view'],
            products: ['view'],
            employees: [],
            clients: ['view'],
          },
        },
      ],
    };

    const company = await prisma.company.create({
      data: creatingData,
    });

    return new CompanyEntity(company);
  }

  async update(
    user: User,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyEntity> {
    const ownerId = user.ownerId;
    const { id, label, logo } = updateCompanyDto;

    let company = await this.prismaService.company.findFirst({
      where: { ownerId, id, status: { not: CompanyStatusType.DELETED } },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    const updateData: any = { ...updateCompanyDto };

    if (label) {
      updateData.slug = Slug(label);
    }

    if (logo && logo.indexOf('data:image') === 0) {
      await this.bucketService.uploadImage(
        this.bucketName,
        updateData.id,
        logo,
      );
      updateData.logo = this.bucketService.getImageUrl(
        this.bucketName,
        updateData.id,
      );
    }

    company = await this.prismaService.company.update({
      where: { id },
      data: updateData,
    });

    return new CompanyEntity(company);
  }

  async get(id: string): Promise<CompanyEntity> {
    const company = await this.prismaService.company.findFirst({
      where: { id, status: { not: CompanyStatusType.DELETED } },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return new CompanyEntity(company);
  }

  async find(findCompanyDto: FindCompanyDto): Promise<FindCompanyResultDto> {
    const where: any = { status: { not: CompanyStatusType.DELETED } };
    const paginationData = FindCompanyDto.getPaginationParams(
      FindCompanyDto as PaginationDto,
    );

    if (findCompanyDto.ownerId) {
      where.ownerId = findCompanyDto.ownerId;
    }

    if (findCompanyDto.label) {
      where.slug = { startsWith: Slug(findCompanyDto.label) };
    }

    if (findCompanyDto.tenantId) {
      where.tenantId = {
        startsWith: findCompanyDto.tenantId,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.address) {
      where.tenantId = {
        startsWith: findCompanyDto.address,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.neighborhood) {
      where.tenantId = {
        startsWith: findCompanyDto.neighborhood,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.city) {
      where.tenantId = {
        startsWith: findCompanyDto.city,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.state) {
      where.tenantId = {
        startsWith: findCompanyDto.state,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.status) {
      where.status = findCompanyDto.status;
    }

    let companies = [];
    const total = await this.prismaService.company.count({
      where,
      skip: paginationData.skip,
    });

    if (total !== 0) {
      companies = await this.prismaService.company.findMany({
        where,
        skip: paginationData.skip,
        take: paginationData.limit,
      });
    }

    return {
      page: where.page,
      limit: where.limit,
      total,
      data: companies.map((c) => new CompanyEntity(c)) || [],
    };
  }

  async findByOwner(ownerId: string): Promise<FindCompanyResultDto> {
    return this.find({ ownerId });
  }

  async delete(user: User, id: string): Promise<void> {
    const ownerId = user.ownerId;

    const company = await this.prismaService.company.findFirst({
      where: { ownerId, id, status: { not: CompanyStatusType.DELETED } },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    await this.prismaService.company.update({
      where: { id: company.id },
      data: {
        status: CompanyStatusType.DELETED,
        deletedAt: new Date(),
      },
    });
  }

  async getTenantId(label: string, prismaHandler?: any): Promise<string> {
    const prisma = prismaHandler || this.prismaService;
    const slug = Slug(label);

    const company = await prisma.company.findFirst({
      where: { slug },
    });

    if (!company) {
      return slug;
    }

    const raw: any = await prisma.$queryRaw`
      select slug
      from companies
      where slug ~ '^${slug}[0-9]+$' order by id desc limit 1;
    `;

    if (!raw || raw.length === 0) {
      return `${slug}1`;
    }

    const last: number = Number(raw[0].slug.replace(/[^0-9]/g, ''));
    return `${slug}${last + 1}`;
  }
}
