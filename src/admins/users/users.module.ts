import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  PrismaService,
  MessagesService,
  BucketsModule,
  NotificationsModule,
  NotificationsService,
} from '@App/shared/modules';
import { AuthModule, JwtStrategy } from '@App/admins/auth';
import { CompaniesService } from '../companies';
import { UsersController } from './users.controller';

@Module({
  imports: [NotificationsModule, AuthModule, BucketsModule],
  controllers: [UsersController],
  providers: [
    NotificationsService,
    MessagesService,
    PrismaService,
    JwtStrategy,
    CompaniesService,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
