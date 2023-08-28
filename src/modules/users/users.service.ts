import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthenticationStatusType, User } from '@prisma/client';
import { PrismaService, MessagesService } from '@App/shared/modules';
import { GeneralUtils } from '@App/shared';
import { AuthenticateUserDto } from './dtos/authenticate-user.dto';
import { ConfirmAuthenticationDto } from './dtos/confirm-authentication.dto';
import { ConfirmAuthenticationResponseDto } from './dtos';
import { CompanyEntity } from '../companies';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageService: MessagesService,
  ) {}

  async getUniqueConfirmationCode(attempts = 10): Promise<string> {
    for (let i = 0; i < attempts; i = i + 1) {
      const confirmationCode = GeneralUtils.generateValidationCode(5);
      const existing = await this.prismaService.authentication.findFirst({
        where: { confirmationCode },
      });

      if (!existing) {
        return confirmationCode;
      }
    }

    throw new HttpException(
      'Error on try to create validationCode [attempts exceeded]',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private async upsertUser(email: string, prismaHandler?: any): Promise<User> {
    const handler = prismaHandler || this.prismaService;
    let user = await prismaHandler.user.findFirst({
      where: { email },
    });

    if (user) {
      return user;
    }

    user = await handler.user.create({ data: { email, name: '' } });

    return handler.user.update({
      where: { email },
      data: { ownerId: user.id },
    });
  }

  async authenticate(authenticateDto: AuthenticateUserDto): Promise<void> {
    await this.prismaService.$transaction(async (prisma) => {
      const { email } = authenticateDto;
      const user = await this.upsertUser(email, prisma);
      const confirmationCode = await this.getUniqueConfirmationCode();

      await prisma.authentication.updateMany({
        where: {
          userId: user.id,
          status: AuthenticationStatusType.PENDING,
        },
        data: { status: AuthenticationStatusType.INACTIVE },
      });

      await prisma.authentication.create({
        data: {
          userId: user.id,
          confirmationCode,
          confirmationExpiredAt: new Date(new Date().getTime() + 15 * 60000),
        },
      });

      await this.messageService.sendEmail({
        email,
        subject: 'Código de autenticação.',
        metadata: { validationCode: confirmationCode },
      });
    });
  }

  async confirmAuthentication(
    confirmAuthenticationDto: ConfirmAuthenticationDto,
  ): Promise<ConfirmAuthenticationResponseDto> {
    const now = new Date();
    const { confirmationCode } = confirmAuthenticationDto;
    const authentication = await this.prismaService.authentication.findFirst({
      where: {
        confirmationCode,
        status: AuthenticationStatusType.PENDING,
        confirmationExpiredAt: { gt: now },
      },
      include: { user: true },
    });

    if (!authentication) {
      throw new HttpException('Registro inválido.', HttpStatus.BAD_REQUEST);
    }

    const companies = await this.prismaService.company.findMany({
      where: { ownerId: authentication.user.ownerId },
    });

    const jwt = GeneralUtils.generateJwt({
      userId: authentication.user.id,
    });

    await this.prismaService.authentication.update({
      where: { id: authentication.id },
      data: {
        confirmationCode: null,
        authenticatedAt: new Date(jwt.createdAt),
        status: AuthenticationStatusType.ACTIVE,
      },
    });

    return {
      userName: authentication.user.name,
      token: jwt.token,
      type: authentication.user.type,
      companies: companies.map((c) => new CompanyEntity(c)),
    };
  }
}
