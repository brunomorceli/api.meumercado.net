import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@App/shared/modules/prisma';
import { BucketsService } from '@App/shared';
import { ProductStatusType, User } from '@prisma/client';
import {
  CreateProductDto,
  FindProductDto,
  FindProductResultDto,
  UpdateProductDto,
} from './dtos';
import { ProductEntity } from './entities';
import { randomUUID } from 'crypto';
import * as Slug from 'slug';

@Injectable()
export class ProductsService {
  private bucketName = 'products';

  constructor(
    private readonly bucketsService: BucketsService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(
    user: User,
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const ownerId = user.ownerId;
    const {
      label,
      price,
      quantity,
      unlimited,
      description,
      cover,
      categories,
      status,
    } = createProductDto;
    const slug = Slug(label);

    let product = await this.prismaService.product.findFirst({
      where: {
        ownerId,
        slug,
        status: { not: ProductStatusType.DELETED },
      },
    });

    if (Boolean(product)) {
      throw new BadRequestException('Já existe um produto com este nome.');
    }

    const data: any = {
      id: randomUUID(),
      label,
      description,
      slug,
      status: status || ProductStatusType.ACTIVE,
      ownerId,
      price,
      quantity,
      unlimited,
      categories,
    };

    if (cover) {
      await this.bucketsService.uploadImage(this.bucketName, data.id, cover);
      data.cover = this.bucketsService.getImageUrl(this.bucketName, data.id);
    }

    product = await this.prismaService.product.create({ data });

    return new ProductEntity(product);
  }

  async update(
    user: User,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const ownerId = user.ownerId;
    const { id, cover, ...updateData } = updateProductDto;

    let product = await this.prismaService.product.findFirst({
      where: { ownerId, id, status: { not: ProductStatusType.DELETED } },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado.');
    }

    let newCover: any = null;
    if (cover && cover.indexOf('data:image') === 0) {
      await this.bucketsService.uploadImage(this.bucketName, product.id, cover);
      newCover = this.bucketsService.getImageUrl(this.bucketName, product.id);
    }

    const slug = Slug(updateProductDto.label || product.label);

    if (updateProductDto.label) {
      const existing = await this.prismaService.product.findFirst({
        where: {
          id: { not: id },
          slug,
          status: { not: ProductStatusType.DELETED },
        },
      });

      if (existing) {
        throw new BadRequestException('Já existe um produto com esse nome.');
      }
    }

    product = await this.prismaService.product.update({
      where: { id },
      data: { ...updateData, slug, cover: newCover || product.cover },
    });

    return new ProductEntity(product);
  }

  async get(user: User, id: string): Promise<ProductEntity> {
    const ownerId = user.ownerId;

    const product = await this.prismaService.product.findFirst({
      where: { ownerId, id, status: { not: ProductStatusType.DELETED } },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado.');
    }

    return new ProductEntity(product);
  }

  async find(
    user: User,
    findProductDto: FindProductDto,
  ): Promise<FindProductResultDto> {
    const ownerId = user.ownerId;
    const { label, status, categoryId } = findProductDto;
    const where: any = {
      ownerId,
      status: { not: ProductStatusType.DELETED },
    };
    const paginationData = FindProductDto.getPaginationParams(findProductDto);

    if (label) {
      where.slug = { startsWith: Slug(label) };
    }

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categories = { has: categoryId };
    }

    let products = [];
    const total = await this.prismaService.product.count({
      where,
      skip: paginationData.skip,
    });
    if (total !== 0) {
      products = await this.prismaService.product.findMany({
        where,
        skip: paginationData.skip,
        take: paginationData.limit,
      });
    }

    return {
      page: paginationData.page,
      limit: paginationData.limit,
      total,
      data: products.map((p) => new ProductEntity(p)) || [],
    };
  }

  async delete(user: User, id: string): Promise<void> {
    const ownerId = user.ownerId;

    const product = await this.prismaService.product.findFirst({
      where: { ownerId, id, status: { not: ProductStatusType.DELETED } },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado.');
    }

    await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        status: ProductStatusType.DELETED,
        deletedAt: new Date(),
      },
    });
  }
}
