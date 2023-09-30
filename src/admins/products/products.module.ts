import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {
  PrismaService,
  MessagesService,
  BucketsService,
} from '@App/shared/modules';
import { AuthModule, JwtStrategy } from '@App/admins/auth';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
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
