import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {
  PrismaService,
  MessagesService,
  BucketsModule,
  BucketsService,
} from '@App/shared';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [BucketsModule],
  controllers: [CompaniesController],
  providers: [MessagesService, BucketsService, PrismaService, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
