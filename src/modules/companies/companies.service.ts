import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanyStatusType, User } from '@prisma/client';
import { PrismaService, PaginationDto, BucketsService } from '@App/shared';
import {
  CheckSubdomainDto,
  CheckSubdomainResultDto,
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
    user: User,
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyEntity> {
    const ownerId = user.ownerId;
    const { logo, subdomain } = createCompanyDto;

    const checkExisting = await this.checkSubdomain({ subdomain });
    if (!checkExisting.available) {
      throw new BadRequestException(
        'Já existe uma empresa com esse subdomínio.',
      );
    }

    const creatingData: any = {
      ...createCompanyDto,
      id: randomUUID(),
      ownerId,
      slug: Slug(createCompanyDto.label),
    };

    if (logo && logo.indexOf('data:image') === 0) {
      await this.bucketService.uploadImage(
        this.bucketName,
        creatingData.id,
        logo,
      );
      creatingData.logo = this.bucketService.getImageUrl(
        this.bucketName,
        creatingData.id,
      );
    }

    await this.prismaService.category.upsert({
      where: {
        slug_owner: {
          slug: 'geral',
          ownerId,
        },
      },
      create: {
        color: '#d9d9d9',
        label: 'Geral',
        slug: 'geral',
        ownerId,
      },
      update: {},
    });

    const company = await this.prismaService.company.create({
      data: creatingData,
    });

    return new CompanyEntity(company);
  }

  async update(
    user: User,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyEntity> {
    const ownerId = user.ownerId;
    const { id, label, logo, subdomain } = updateCompanyDto;

    let company = await this.prismaService.company.findFirst({
      where: { ownerId, id, status: { not: CompanyStatusType.DELETED } },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    if (subdomain) {
      const checkExisting = await this.checkSubdomain({
        subdomain,
        companyId: id,
      });
      if (!checkExisting.available) {
        throw new BadRequestException(
          'Já existe uma empresa com esse subdomínio.',
        );
      }
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
      updateCompanyDto.logo = this.bucketService.getImageUrl(
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

    if (findCompanyDto.subdomain) {
      where.subdomain = {
        startsWith: findCompanyDto.subdomain,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.address) {
      where.subdomain = {
        startsWith: findCompanyDto.address,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.neighborhood) {
      where.subdomain = {
        startsWith: findCompanyDto.neighborhood,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.city) {
      where.subdomain = {
        startsWith: findCompanyDto.city,
        mode: 'insensitive',
      };
    }

    if (findCompanyDto.state) {
      where.subdomain = {
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

  async checkSubdomain(
    checkSubdomainDto: CheckSubdomainDto,
  ): Promise<CheckSubdomainResultDto> {
    const { companyId, subdomain } = checkSubdomainDto;
    const where: any = {
      subdomain,
      status: { not: CompanyStatusType.DELETED },
    };

    if (companyId) {
      where.id = { not: companyId };
    }

    const company = await this.prismaService.company.findFirst({ where });
    return {
      available: !company,
      suggestions: [],
    };
  }
}
