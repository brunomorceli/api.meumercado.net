import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { PrismaService } from '@App/prisma';

@Module({
  controllers: [BrandsController],
  providers: [PrismaService, BrandsService],
})
export class BrandsModule {}
