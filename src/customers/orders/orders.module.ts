import { Module } from '@nestjs/common';
import {
  NotificationsModule,
  NotificationsService,
  PrismaService,
} from '@App/shared';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule, JwtStrategy } from '@App/customers/auth';

@Module({
  imports: [NotificationsModule, AuthModule],
  controllers: [OrdersController],
  providers: [PrismaService, JwtStrategy, NotificationsService, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
