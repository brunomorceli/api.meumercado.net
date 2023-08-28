import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {
  PrismaService,
  MessagesService,
  AuthModule,
  JwtStrategy,
} from '@App/shared';

@Module({
  imports: [AuthModule],
  controllers: [CategoriesController],
  providers: [MessagesService, PrismaService, JwtStrategy, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
