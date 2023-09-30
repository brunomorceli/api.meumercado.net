import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  PrismaService,
  MessagesService,
  BucketsModule,
} from '@App/shared/modules';
import { AuthModule, JwtStrategy } from '@App/admins/auth';
import { CompaniesService } from '../companies';
import { UsersController } from './users.controller';

@Module({
  imports: [AuthModule, BucketsModule],
  controllers: [UsersController],
  providers: [
    MessagesService,
    PrismaService,
    JwtStrategy,
    CompaniesService,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
