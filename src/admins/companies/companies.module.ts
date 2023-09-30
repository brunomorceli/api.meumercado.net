import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import {
  PrismaService,
  MessagesService,
  AuthModule,
  AdminAuthStrategy,
  BucketsModule,
} from '@App/shared';
import { CompaniesUsersController } from './companies-users.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [BucketsModule, AuthModule],
  controllers: [CompaniesController, CompaniesUsersController],
  providers: [
    MessagesService,
    PrismaService,
    AdminAuthStrategy,
    OrdersService,
    CompaniesService,
  ],
  exports: [CompaniesService, OrdersService],
})
export class CompaniesModule {}
