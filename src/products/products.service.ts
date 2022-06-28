import { PrismaService } from '@App/prisma';
import { GeneralUtils } from '@App/utils';
import { Injectable } from '@nestjs/common';
import { ProductStatusType } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    const search = GeneralUtils.toSearchText(createProductDto.label);
    return this.prismaService.product.create({
      data: { ...createProductDto, search },
    });
  }

  findAll(placeId: string) {
    return this.prismaService.product.findMany({ where: { placeId } });
  }

  findOne(id: string) {
    return this.prismaService.product.findFirst({ where: { id } });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const data: any = { ...updateProductDto };
    if (updateProductDto.label) {
      data.search = GeneralUtils.toSearchText(updateProductDto.label);
    }

    return this.prismaService.product.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prismaService.product.update({
      where: { id },
      data: { status: ProductStatusType.DELETED },
    });
  }
}
