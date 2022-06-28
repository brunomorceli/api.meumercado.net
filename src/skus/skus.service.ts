import { PrismaService } from '@App/prisma';
import { GeneralUtils } from '@App/utils';
import { Injectable } from '@nestjs/common';
import { SkuStatusType } from '@prisma/client';
import { CreateSkusDto } from './dto/create-skus.dto';
import { UpdateSkusDto } from './dto/update-skus.dto';

@Injectable()
export class SkusService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createSkusDto: CreateSkusDto) {
    const search = GeneralUtils.toSearchText(createSkusDto.label);
    return this.prismaService.sku.create({
      data: { ...createSkusDto, search },
    });
  }

  findAll(productId: string) {
    return this.prismaService.sku.findMany({ where: { productId } });
  }

  findOne(id: string) {
    return this.prismaService.sku.findMany({ where: { id } });
  }

  update(updateSkusDto: UpdateSkusDto) {
    const data: any = { ...updateSkusDto };
    if (data.label) {
      data.label = GeneralUtils.toSearchText(data.label);
    }

    return this.prismaService.sku.update({
      where: { id: updateSkusDto.id },
      data,
    });
  }

  remove(id: string) {
    return this.prismaService.sku.update({
      where: { id },
      data: { status: SkuStatusType.DELETED },
    });
  }
}
