import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {
  PrismaService,
  MessagesService,
  BucketsService,
} from '@App/shared/modules';
import { AuthModule, JwtStrategy } from '@App/admins/auth';
import { ProductBasesController } from './product-base.controller';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController, ProductBasesController],
  providers: [
    BucketsService,
    MessagesService,
    PrismaService,
    JwtStrategy,
    ProductsService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
