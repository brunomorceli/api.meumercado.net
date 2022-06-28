import { PrismaService } from '@App/prisma';
import { GeneralUtils } from '@App/utils';
import { Injectable } from '@nestjs/common';
import { Strategy, StrategyStatusType } from '@prisma/client';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';

@Injectable()
export class StrategiesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createStrategyDto: CreateStrategyDto): Promise<Strategy> {
    const search = GeneralUtils.toSearchText(createStrategyDto.label);
    return this.prismaService.strategy.create({
      data: { ...createStrategyDto, search },
    });
  }

  findAll(placeId: string): Promise<Array<Strategy>> {
    return this.prismaService.strategy.findMany({ where: { placeId } });
  }

  findOne(id: string): Promise<Strategy> {
    return this.prismaService.strategy.findFirst({ where: { id } });
  }

  update(updateStrategyDto: UpdateStrategyDto): Promise<Strategy> {
    const data: any = { ...updateStrategyDto };
    if (updateStrategyDto.label) {
      data.search = GeneralUtils.toSearchText(updateStrategyDto.label);
    }

    return this.prismaService.strategy.update({
      where: { id: updateStrategyDto.id },
      data: { ...updateStrategyDto },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.strategy.update({
      where: { id },
      data: { status: StrategyStatusType.DELETED },
    });
  }
}
