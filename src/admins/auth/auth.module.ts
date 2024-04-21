import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '@App/shared/modules/prisma';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  BucketsModule,
  MessagesModule,
  MessagesService,
  PagarmeModule,
  PagarmeService,
} from '@App/shared';
import { CompaniesModule, CompaniesService } from '../companies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ADMIN_JWT_SECRET || 'secret',
    }),
    MessagesModule,
    BucketsModule,
    CompaniesModule,
    PagarmeModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    MessagesService,
    JwtService,
    CompaniesService,
    PagarmeService,
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
