import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '@App/prisma';

@Module({
  controllers: [ProductsController],
  providers: [PrismaService, ProductsService],
})
export class ProductsModule {}
