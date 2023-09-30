import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {
  PrismaService,
  MessagesService,
  BucketsService,
} from '@App/shared/modules';
import { AuthModule, AdminAuthStrategy } from '@App/shared/modules/auth';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [
    BucketsService,
    MessagesService,
    PrismaService,
    AdminAuthStrategy,
    ProductsService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
