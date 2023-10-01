import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '@App/shared/modules';
import { AuthModule, JwtStrategy } from '@App/customers/auth';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [PrismaService, JwtStrategy, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
