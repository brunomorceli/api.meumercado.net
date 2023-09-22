import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import {
  PrismaService,
  MessagesService,
  AuthModule,
  JwtStrategy,
  BucketsModule,
} from '@App/shared';
import { CompaniesUsersController } from './companies-users.controller';

@Module({
  imports: [BucketsModule, AuthModule],
  controllers: [CompaniesController, CompaniesUsersController],
  providers: [MessagesService, PrismaService, JwtStrategy, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
