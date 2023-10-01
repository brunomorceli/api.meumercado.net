import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  PrismaService,
  MessagesService,
  BucketsModule,
} from '@App/shared/modules';
import { AuthModule, JwtStrategy } from '@App/customers/auth';
import { UsersController } from './users.controller';

@Module({
  imports: [AuthModule, BucketsModule],
  controllers: [UsersController],
  providers: [MessagesService, PrismaService, JwtStrategy, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
