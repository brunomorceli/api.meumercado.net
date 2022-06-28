import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaService } from '@App/prisma';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MessagesService } from '@App/messages';
import { JwtStrategy } from '@App/security';
import { PlacesService } from '@App/places/places.service';
import { UsersInvitationController } from './users.invitations.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule],
  providers: [
    PrismaService,
    JwtStrategy,
    MessagesService,
    UsersService,
    PlacesService,
  ],
  controllers: [UsersController, UsersInvitationController],
  exports: [UsersService],
})
export class UsersModule {}
