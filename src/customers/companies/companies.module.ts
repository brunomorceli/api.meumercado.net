import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PrismaService } from '@App/shared';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [],
  controllers: [CompaniesController],
  providers: [PrismaService, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
