import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthStrategy } from './admin-auth.strategy';
import { PrismaService } from '@App/shared/modules/prisma';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
  ],
  providers: [PrismaService, AdminAuthStrategy],
})
export class AuthModule {}
