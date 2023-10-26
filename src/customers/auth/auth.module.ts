import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '@App/shared/modules/prisma';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BucketsModule, MessagesModule, MessagesService } from '@App/shared';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.CUSTOMER_JWT_SECRET || 'secret',
    }),
    MessagesModule,
    BucketsModule,
  ],
  controllers: [AuthController],
  providers: [PrismaService, MessagesService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
