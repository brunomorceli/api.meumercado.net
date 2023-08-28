import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService, MessagesService } from '@App/shared/modules';
import { AuthModule, JwtStrategy } from '@App/shared/modules/auth';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [MessagesService, PrismaService, JwtStrategy, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
