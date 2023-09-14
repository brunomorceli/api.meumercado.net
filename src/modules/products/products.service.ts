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
    const data: any = {
      ...createProductDto,
      ownerId,
      id: randomUUID(),
      status: createProductDto.status || ProductStatusType.ACTIVE,
      slug: Slug(createProductDto.label),
    };

    let product = await this.prismaService.product.findFirst({
      where: {
        ownerId,
        slug: data.slug,
        status: { not: ProductStatusType.DELETED },
      },
    });

    if (Boolean(product)) {
      throw new BadRequestException('Já existe um produto com este nome.');
    }

    for (let i = 0; i < data.pictures.length; i++) {
      await this.bucketsService.uploadImage(
        this.bucketName,
        data.id,
        data.pictures[i],
      );
      data.pictures.push(
        this.bucketsService.getImageUrl(this.bucketName, data.id),
      );
    }

    product = await this.prismaService.product.create({ data });

    return new ProductEntity(product);
  }

  async update(
    user: User,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const ownerId = user.ownerId;
    const { id, ...updateData } = updateProductDto;

    let product = await this.prismaService.product.findFirst({
      where: { ownerId, id, status: { not: ProductStatusType.DELETED } },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado.');
    }

    if (updateData.pictures) {
      for (let i = 0; i < updateData.pictures.length; i++) {
        if (updateData.pictures[i].indexOf('data:image') !== 0) {
          continue;
        }

        await this.bucketsService.uploadImage(
          this.bucketName,
          product.id,
          updateData.pictures[i],
        );

        updateData.pictures[i] = this.bucketsService.getImageUrl(
          this.bucketName,
          product.id,
        );
      }
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
      data: {
        ...updateData,
        measures: updateData.measures as any,
        slug,
      },
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
    const { label, status, categoryId, companyId } = findProductDto;
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

    if (companyId) {
      where.companyId = companyId;
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
