import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@App/shared/modules/prisma';
import { FindProductDto, FindProductResultDto } from './dtos';
import { ProductEntity } from './entities';
import * as Slug from 'slug';
import { GeneralUtils } from '@App/shared';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async find(
    tenantId: string,
    findProductDto: FindProductDto,
  ): Promise<FindProductResultDto> {
    const { label, categories, onSale } = findProductDto;

    const company = await this.prismaService.company.findUnique({
      where: { tenantId },
    });

    if (!company) {
      throw new BadRequestException('Registro inválido.');
    }

    const where: any = { companyId: company.id, deletedAt: null };
    const paginationData = FindProductDto.getPaginationParams(findProductDto);

    if (label) {
      where.slug = { startsWith: Slug(label) };
    }

    if (categories) {
      where.OR = [...categories.map((c) => ({ categories: { has: c } }))];
    }

    if (onSale) {
      where.discountPrice = { gt: 0 };
    }

    let products = [];
    const total = await this.prismaService.product.count({ where });
    if (total !== 0) {
      if (findProductDto.random && total > 12) {
        const shuffle = GeneralUtils.generateShuffleArray(total).slice(0, 12);

        for (const skip of shuffle) {
          products.push(
            await this.prismaService.product.findFirst({ where, skip }),
          );
        }
      } else {
        products = await this.prismaService.product.findMany({
          where,
          skip: paginationData.skip,
          take: paginationData.limit,
          orderBy: [{ label: 'asc' }],
        });
      }
    }

    return {
      page: paginationData.page,
      limit: paginationData.limit,
      total,
      data: products.map((p) => new ProductEntity(p)) || [],
    };
  }

  async get(tenantId: string, productId: string): Promise<ProductEntity> {
    const company = await this.prismaService.company.findUnique({
      where: { tenantId },
    });

    if (!company) {
      throw new BadRequestException('Registro inválido.');
    }

    const product = await this.prismaService.product.findFirst({
      where: {
        id: productId,
        companyId: company.id,
      },
    });

    return new ProductEntity(product);
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
