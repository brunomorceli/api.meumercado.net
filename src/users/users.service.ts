import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserStatusType } from '@prisma/client';

import { MessagesService } from '@App/messages';
import { PrismaService } from '@App/prisma';
import { GeneralUtils } from '@App/utils';
import {
  UserHandler,
  UserAuthenticateDto,
  UserValidateResponse,
  UserValidateDto,
  UsersQuery,
} from '@App/users';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageService: MessagesService,
  ) {}

  async getUniqueValidationCode(attempts = 10): Promise<string> {
    for (let i = 0; i < attempts; i = i + 1) {
      const validationCode = GeneralUtils.generateValidationCode();
      const existing = await this.prismaService.user.findFirst({
        where: { validationCode },
      });

      if (!existing) {
        return validationCode;
      }
    }

    throw new HttpException(
      'Error on try to create validationCode [attempts exceeded]',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private async upsertUser(
    authenticateDto: UserAuthenticateDto,
  ): Promise<User> {
    const { email } = authenticateDto;
    let user = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (user) {
      return user;
    }

    user = await this.prismaService.user.create({ data: { email } });

    return this.prismaService.user.update({
      where: { email },
      data: { ownerId: user.id },
    });
  }

  async authenticate(authenticateDto: UserAuthenticateDto): Promise<void> {
    const { email } = authenticateDto;
    const validationCode = await this.getUniqueValidationCode();

    const user = await this.upsertUser(authenticateDto);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        validationCode,
        sessionToken: null,
      },
    });

    await this.messageService.sendEmail({
      email,
      metadata: { validationCode },
    });
  }

  async validateCode(
    userValidateDto: UserValidateDto,
  ): Promise<UserValidateResponse> {
    const { validationCode } = userValidateDto;
    const user = await this.prismaService.user.findFirst({
      where: { validationCode },
    });

    if (!user) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    const tokenData = GeneralUtils.generateJwt({ userId: user.id });

    try {
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          validateAt: tokenData.createdAt,
          validationCode: null,
          sessionToken: tokenData.token,
          status: UserStatusType.ACTIVE,
        },
      });
    } catch (error) {
      throw error;
    }

    return { user: UserHandler.getSafeData(user), token: tokenData.token };
  }

  async checkAuth(id: string, validateAt: string): Promise<User> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          id,
          validateAt,
          NOT: [
            { status: UserStatusType.INACTIVE },
            { status: UserStatusType.DELETED },
          ],
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async find(userQuery: UsersQuery): Promise<Array<User>> {
    try {
      const rows = await this.prismaService.user.findMany(
        UserHandler.userQueryToDatabase(userQuery),
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }

  async findOne(query: UsersQuery): Promise<User> {
    try {
      return await this.prismaService.user.findFirst(
        UserHandler.userQueryToDatabase(query),
      );
    } catch (error) {
      throw error;
    }
  }
}
