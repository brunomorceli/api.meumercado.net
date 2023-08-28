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

@Module({
  imports: [BucketsModule, AuthModule],
  controllers: [CompaniesController],
  providers: [MessagesService, PrismaService, JwtStrategy, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
