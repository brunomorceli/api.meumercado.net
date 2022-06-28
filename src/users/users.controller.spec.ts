import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaService } from '@App/prisma';
import { UsersService, UsersController } from '@App/users';
import { JwtStrategy } from '@App/security';
import { MessagesService } from '@App/messages';

describe('UsersController', () => {
  let usersService: UsersService;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule],
      providers: [PrismaService, JwtStrategy, MessagesService, UsersService],
      controllers: [UsersController],
      exports: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(controller).toBeDefined();
  });
});
