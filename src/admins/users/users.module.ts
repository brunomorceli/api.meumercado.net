import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {
  PrismaService,
  MessagesService,
  BucketsModule,
} from '@App/shared/modules';
import { AuthModule, AdminAuthStrategy } from '@App/shared/modules/auth';
import { CompaniesService } from '../companies';

@Module({
  imports: [AuthModule, BucketsModule],
  controllers: [UsersController],
  providers: [
    MessagesService,
    PrismaService,
    AdminAuthStrategy,
    CompaniesService,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
