import { Module } from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { StrategiesController } from './strategies.controller';
import { PrismaService } from '@App/prisma';

@Module({
  controllers: [StrategiesController],
  providers: [PrismaService, StrategiesService],
})
export class StrategiesModule {}
