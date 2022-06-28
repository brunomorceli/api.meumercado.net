import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '@App/prisma';
import { UsersController, UsersService } from '@App/users';
import { JwtStrategy } from '@App/security';
import { MessagesService } from '@App/messages';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule],
      providers: [PrismaService, JwtStrategy, MessagesService, UsersService],
      controllers: [UsersController],
      exports: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
