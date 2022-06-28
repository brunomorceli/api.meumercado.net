import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthType, User, UserStatusType } from '@prisma/client';

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

  private getUpsertBaseData(data: any = {}): any {
    return {
      authType: data.authType || AuthType.EMAIL,
      validationCode: data.validationCode || undefined,
      email: data.email || undefined,
      phoneNumber: data.phoneNumber || undefined,
      thirdPartyId: data.thirdPartyId || undefined,
      thirdPartyToken: data.thirdPartyToken || undefined,
      metadata: data.metadata || {},
      validateAt: data.validateAt || null,
      sessionToken: data.sessionToken || null,
      status: data.status || UserStatusType.VALIDATION,
    };
  }

  private async authenticateEmail(
    authenticateDto: UserAuthenticateDto,
  ): Promise<void> {
    const { email } = authenticateDto;
    const validationCode = await this.getUniqueValidationCode();

    const upsertData = this.getUpsertBaseData({
      validationCode,
      email,
      authType: AuthType.EMAIL,
    });

    await this.prismaService.user.upsert({
      where: UserHandler.authenticateDtoToQuery(authenticateDto),
      create: upsertData,
      update: upsertData,
    });

    await this.messageService.sendEmail({
      email,
      metadata: { validationCode },
    });
  }

  private async authenticatePhoneNumber(
    authenticateDto: UserAuthenticateDto,
  ): Promise<void> {
    const { phoneNumber } = authenticateDto;
    const validationCode = await this.getUniqueValidationCode();

    const upsertData = this.getUpsertBaseData({
      validationCode,
      phoneNumber,
      authType: AuthType.PHONE_NUMBER,
    });

    await this.prismaService.user.upsert({
      where: UserHandler.authenticateDtoToQuery(authenticateDto),
      create: upsertData,
      update: upsertData,
    });

    await this.messageService.sendSms({
      phoneNumber,
      metadata: { validationCode },
    });
  }

  private async authenticateThirdParty(
    authenticateDto: UserAuthenticateDto,
  ): Promise<UserValidateResponse> {
    const { authType, thirdPartyId, thirdPartyToken, metadata } =
      authenticateDto;

    const upsertData = this.getUpsertBaseData({
      authType,
      thirdPartyId,
      thirdPartyToken,
      metadata,
    });

    const user = await this.prismaService.user.upsert({
      where: UserHandler.authenticateDtoToQuery(authenticateDto),
      create: upsertData,
      update: upsertData,
    });

    const tokenData = GeneralUtils.generateJwt({ userId: user.id });

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        sessionToken: tokenData.token,
        validateAt: tokenData.createdAt,
        status: UserStatusType.ACTIVE,
      },
    });

    return { token: tokenData.token };
  }

  async authenticate(
    authenticateDto: UserAuthenticateDto,
  ): Promise<UserValidateResponse | void> {
    const { authType } = authenticateDto;
    switch (authType) {
      case AuthType.EMAIL:
        return this.authenticateEmail(authenticateDto);
      case AuthType.PHONE_NUMBER:
        return this.authenticatePhoneNumber(authenticateDto);
      default:
        return this.authenticateThirdParty(authenticateDto);
    }
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

    return { token: tokenData.token };
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
