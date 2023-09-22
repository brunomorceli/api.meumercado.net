import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@App/shared/modules/prisma';
import { BucketsService } from '@App/shared';
import { ProductStatusType } from '@prisma/client';
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
    companyId: string,
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const data: any = {
      ...createProductDto,
      companyId,
      id: randomUUID(),
      status: createProductDto.status || ProductStatusType.ACTIVE,
      slug: Slug(createProductDto.label),
    };

    let product = await this.prismaService.product.findFirst({
      where: {
        companyId,
        slug: data.slug,
        deletedAt: null,
      },
    });

    if (Boolean(product)) {
      throw new BadRequestException('Já existe um produto com este nome.');
    }

    const pictures = [];
    for (let i = 0; i < data.pictures.length; i++) {
      const imageName = `${data.id}_${randomUUID()}`;

      await this.bucketsService.uploadImage(
        this.bucketName,
        imageName,
        data.pictures[i],
      );
      pictures.push(
        this.bucketsService.getImageUrl(this.bucketName, imageName),
      );
    }

    data.pictures = pictures;

    product = await this.prismaService.product.create({ data });

    return new ProductEntity(product);
  }

  async update(
    companyId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const { id, ...updateData } = updateProductDto;

    let product = await this.prismaService.product.findFirst({
      where: { companyId, id, deletedAt: null },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado.');
    }

    if (updateData.pictures) {
      for (let i = 0; i < updateData.pictures.length; i++) {
        if (updateData.pictures[i].indexOf('data:image') !== 0) {
          continue;
        }

        const imageName = `${product.id}_${randomUUID()}`;
        await this.bucketsService.uploadImage(
          this.bucketName,
          imageName,
          updateData.pictures[i],
        );

        updateData.pictures[i] = this.bucketsService.getImageUrl(
          this.bucketName,
          imageName,
        );
      }
    }

    const slug = Slug(updateProductDto.label || product.label);

    if (updateProductDto.label) {
      const existing = await this.prismaService.product.findFirst({
        where: {
          id: { not: id },
          slug,
          deletedAt: null,
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
        attributes: updateData.attributes as any,
        slug,
        updatedAt: new Date(),
      },
    });

    return new ProductEntity(product);
  }

  async get(companyId: string, id: string): Promise<ProductEntity> {
    const product = await this.prismaService.product.findFirst({
      where: { companyId, id, deletedAt: null },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado.');
    }

    return new ProductEntity(product);
  }

  async find(
    companyId: string,
    findProductDto: FindProductDto,
  ): Promise<FindProductResultDto> {
    const { label, status, categoryId } = findProductDto;
    const where: any = {
      companyId: findProductDto.companyId || companyId,
      deletedAt: null,
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

  async delete(companyId: string, id: string): Promise<void> {
    const product = await this.prismaService.product.findFirst({
      where: { companyId, id, deletedAt: null },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado.');
    }

    await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    });
  }
}
