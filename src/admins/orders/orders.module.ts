import { Module } from '@nestjs/common';
import { PrismaService } from '@App/shared';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule, JwtStrategy } from '@App/admins/auth';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [PrismaService, JwtStrategy, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
