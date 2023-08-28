import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CompanyProductStatusType,
  CompanyStatusType,
  User,
} from '@prisma/client';
import { PrismaService, PaginationDto, BucketsService } from '@App/shared';
import {
  CheckSubdomainDto,
  CheckSubdomainResultDto,
  CreateCompanyDto,
  FindCompanyDto,
  FindCompanyProductDto,
  FindCompanyResultDto,
  UpdateCompanyDto,
} from './dtos';
import { CompanyEntity, CompanyProductEntity } from './entities';
import { randomUUID } from 'crypto';
import { UpsertCompanyProductDto } from './dtos/company-product/upsert-company-product.dto';
import { FindCompanyProductResultDto } from './dtos/company-product/find-company-product-result.dto';
import Slug from 'slug';

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
    const { blob, subdomain } = createCompanyDto;

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

    if (blob) {
      await this.bucketService.uploadImage(
        this.bucketName,
        creatingData.id,
        blob,
      );

      creatingData.logo = this.bucketService.getImageUrl(
        this.bucketName,
        creatingData.id,
      );
    }

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
    const { id, label, blob, subdomain } = updateCompanyDto;

    let company = await this.prismaService.company.findFirst({
      where: { ownerId, id, status: { not: CompanyStatusType.DELETED } },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    if (subdomain) {
      const checkExisting = await this.checkSubdomain({ subdomain, id });
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

    if (blob) {
      await this.bucketService.uploadImage(this.bucketName, id, blob);
      updateData.logo = this.bucketService.getImageUrl(this.bucketName, id);
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

    if (findCompanyDto.slug) {
      where.slug = { startsWith: findCompanyDto.slug };
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
    const { id, subdomain } = checkSubdomainDto;
    const where: any = {
      subdomain,
      status: { not: CompanyStatusType.DELETED },
    };

    if (id) {
      where.id = { not: id };
    }

    const company = await this.prismaService.company.findFirst(where);
    return {
      available: !company,
      suggestions: [],
    };
  }

  async upsertProduct(
    user: User,
    upsertCompanyProductDto: UpsertCompanyProductDto,
  ): Promise<CompanyProductEntity> {
    const { ownerId } = user;
    const { id, ...updateData } = upsertCompanyProductDto;
    const { productId, companyId } = upsertCompanyProductDto;

    const product = await this.prismaService.product.findFirst({
      where: { id: productId, ownerId },
    });

    if (!product) {
      throw new HttpException(
        'Produto não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const company = await this.prismaService.company.findFirst({
      where: { id: companyId, ownerId },
    });

    if (!company) {
      throw new HttpException(
        'Empresa não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const where: any = { productId, companyId };

    if (id) {
      where.id = id;
    }

    const companyProduct = await this.prismaService.companyProduct.upsert({
      where,
      update: updateData,
      create: updateData,
      include: { product: true, category: true },
    });

    return new CompanyProductEntity(companyProduct);
  }

  async getProduct(id: string): Promise<CompanyProductEntity> {
    const companyProduct = await this.prismaService.companyProduct.findFirst({
      where: { id, status: { not: CompanyProductStatusType.DELETED } },
    });

    if (!companyProduct) {
      throw new HttpException(
        'Produto não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return new CompanyProductEntity(companyProduct);
  }

  async findProduct(
    findCompanyProductDto: FindCompanyProductDto,
  ): Promise<FindCompanyProductResultDto> {
    const { companyId, slug, status } = findCompanyProductDto;
    const where: any = { status: { not: CompanyProductStatusType.DELETED } };

    if (companyId) {
      where.companyId = companyId;
    }

    if (slug) {
      where.slug = { startsWith: slug };
    }

    if (status) {
      where.status = status;
    }

    let companyProducts = [];
    const paginationData = FindCompanyProductDto.getPaginationParams(
      findCompanyProductDto,
    );

    const total = await this.prismaService.companyProduct.count({
      where,
      skip: paginationData.skip,
    });

    if (total !== 0) {
      companyProducts = await this.prismaService.companyProduct.findMany({
        where,
        include: { product: true, category: true },
        skip: paginationData.skip,
        take: paginationData.limit,
      });
    }

    return {
      page: paginationData.page,
      limit: paginationData.limit,
      total,
      data: companyProducts.map((cp) => new CompanyProductEntity(cp)) || [],
    };
  }

  async deleteProduct(id: string): Promise<CompanyProductEntity> {
    let companyProduct = await this.prismaService.companyProduct.findFirst({
      where: { id, status: { not: CompanyProductStatusType.DELETED } },
    });

    if (!companyProduct) {
      throw new HttpException(
        'Produto não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    companyProduct = await this.prismaService.companyProduct.update({
      where: { id: companyProduct.id },
      data: {
        status: CompanyProductStatusType.DELETED,
        deletedAt: new Date(),
      },
    });

    return new CompanyProductEntity(companyProduct);
  }
}
