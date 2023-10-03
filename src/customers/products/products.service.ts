import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@App/shared/modules/prisma';
import { FindProductDto, FindProductResultDto } from './dtos';
import { ProductEntity } from './entities';
import * as Slug from 'slug';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async find(
    tenantId: string,
    findProductDto: FindProductDto,
  ): Promise<FindProductResultDto> {
    const { label, categoryId } = findProductDto;

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
