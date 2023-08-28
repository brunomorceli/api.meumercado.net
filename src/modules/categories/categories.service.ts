import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryStatusType, User } from '@prisma/client';
import { PrismaService, PaginationDto } from '@App/shared';
import Slug from 'slug';
import {
  CreateCategoryDto,
  FindCategoryDto,
  FindCategoryResultDto,
  UpdateCategoryDto,
} from './dtos';
import { CategoryEntity } from './entities';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    user: User,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const ownerId = user.ownerId;
    const { label, color } = createCategoryDto;
    const slug = Slug(label);

    let category = await this.prismaService.category.findFirst({
      where: {
        ownerId,
        slug,
        status: { not: CategoryStatusType.DELETED },
      },
    });

    if (Boolean(category)) {
      throw new BadRequestException('Já existe uma categoria com este nome.');
    }

    category = await this.prismaService.category.create({
      data: { label, slug, color, ownerId },
    });

    return new CategoryEntity(category);
  }

  async update(
    user: User,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const ownerId = user.ownerId;
    const { id, label } = updateCategoryDto;

    let category = await this.prismaService.category.findFirst({
      where: { ownerId, id, status: { not: CategoryStatusType.DELETED } },
    });

    if (!category) {
      throw new BadRequestException('Categoria não encontrada');
    }

    const slug = Slug(label || category.label);

    if (label) {
      const existing = await this.prismaService.category.findFirst({
        where: {
          id: { not: id },
          slug,
          status: { not: CategoryStatusType.DELETED },
        },
      });

      if (existing) {
        throw new BadRequestException('Já existe uma categoria com esse nome.');
      }
    }

    category = await this.prismaService.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        slug,
      },
    });

    return new CategoryEntity(category);
  }

  async get(user: User, id: string): Promise<CategoryEntity> {
    const ownerId = user.ownerId;

    const category = await this.prismaService.category.findFirst({
      where: { ownerId, id, status: { not: CategoryStatusType.DELETED } },
    });

    if (!category) {
      throw new BadRequestException('Categoria não encontrada');
    }

    return new CategoryEntity(category);
  }

  async find(
    user: User,
    findCategoryDto: FindCategoryDto,
  ): Promise<FindCategoryResultDto> {
    const ownerId = user.ownerId;
    const { label, color, parentId, status } = findCategoryDto;
    const where: any = {
      ownerId,
      status: { not: CategoryStatusType.DELETED },
    };
    const paginationData = FindCategoryDto.getPaginationParams(
      FindCategoryDto as PaginationDto,
    );

    if (label) {
      where.slug = { startsWith: Slug(label) };
    }

    if (color) {
      where.color = color;
    }

    if (parentId) {
      where.parentId = parentId;
    }

    if (status) {
      where.status = status;
    }

    let categories = [];
    const total = await this.prismaService.category.count({
      where,
      skip: paginationData.skip,
    });
    if (total !== 0) {
      categories = await this.prismaService.category.findMany({
        where,
        skip: paginationData.skip,
        take: paginationData.limit,
      });
    }

    return {
      page: where.page,
      limit: where.limit,
      total,
      data: categories.map((c) => new CategoryEntity(c)) || [],
    };
  }

  async delete(user: User, id: string): Promise<void> {
    const ownerId = user.ownerId;

    const category = await this.prismaService.category.findFirst({
      where: { ownerId, id, status: { not: CategoryStatusType.DELETED } },
    });

    if (!category) {
      throw new BadRequestException('Categoria não encontrada');
    }

    await this.prismaService.category.update({
      where: { id: category.id },
      data: {
        status: CategoryStatusType.DELETED,
        deletedAt: new Date(),
      },
    });
  }
}
