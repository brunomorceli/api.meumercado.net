import { PrismaService } from '@App/prisma';
import { GeneralUtils } from '@App/utils';
import { Injectable } from '@nestjs/common';
import { Brand, BrandStatusType } from '@prisma/client';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const search = GeneralUtils.toSearchText(createBrandDto.label);

    return this.prismaService.brand.create({
      data: { ...createBrandDto, search },
    });
  }

  findAll(placeId: string): Promise<Array<Brand>> {
    return this.prismaService.brand.findMany({ where: { id: placeId } });
  }

  findOne(id: string): Promise<Brand> {
    return this.prismaService.brand.findFirst({ where: { id } });
  }

  update(updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const { id } = updateBrandDto;
    return this.prismaService.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  remove(id: string): Promise<Brand> {
    return this.prismaService.brand.update({
      where: { id },
      data: { status: BrandStatusType.DELETED },
    });
  }
}
