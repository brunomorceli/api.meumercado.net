import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AuthenticationStatusType,
  CompanyStatusType,
  UserStatusType,
} from '@prisma/client';
import { PrismaService, MessagesService } from '@App/shared/modules';
import { GeneralUtils } from '@App/shared';
import { AuthenticateUserDto } from './dtos/authenticate-user.dto';
import { ConfirmAuthenticationDto } from './dtos/confirm-authentication.dto';
import {
  AuthenticateUserResponseDto,
  ConfirmAuthenticationResponseDto,
} from './dtos';
import { CompaniesService, CompanyEntity } from '../companies';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageService: MessagesService,
    private readonly companiesService: CompaniesService,
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

  async authenticate(
    authenticateDto: AuthenticateUserDto,
  ): Promise<AuthenticateUserResponseDto> {
    const [auth, company] = await this.prismaService.$transaction(
      async (prisma) => {
        const { email, label } = authenticateDto;

        const upsertId = randomUUID();
        const user = await this.prismaService.user.upsert({
          where: { email },
          create: {
            id: upsertId,
            ownerId: upsertId,
            email,
            status: UserStatusType.ACTIVE,
          },
          update: {},
          include: { company: true },
        });

        let company: any = user.company;

        if (!company) {
          if (!label) {
            return [null, null];
          }

          company = await this.companiesService.create(
            { email, label },
            prisma,
          );
        }

        const confirmationCode = await this.getUniqueConfirmationCode();

        await prisma.authentication.updateMany({
          where: {
            userId: user.id,
            status: AuthenticationStatusType.PENDING,
          },
          data: {
            status: AuthenticationStatusType.INACTIVE,
            confirmationCode: '',
          },
        });

        const auth = await prisma.authentication.create({
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

        return [auth, company];
      },
    );

    return Promise.resolve({
      tenantId: company ? company.tenantId : null,
      authId: auth ? auth.id : null,
    });
  }

  async confirmAuthentication(
    confirmAuthenticationDto: ConfirmAuthenticationDto,
  ): Promise<ConfirmAuthenticationResponseDto> {
    const now = new Date();
    const { confirmationCode, authId } = confirmAuthenticationDto;

    const authentication = await this.prismaService.authentication.findFirst({
      where: {
        id: authId,
        confirmationCode,
        status: AuthenticationStatusType.PENDING,
        confirmationExpiredAt: { gt: now },
      },
      include: { user: true },
    });

    if (!authentication) {
      throw new HttpException('Registro inválido.', HttpStatus.BAD_REQUEST);
    }

    const company = await this.prismaService.company.findFirst({
      where: {
        ownerId: authentication.user.id,
        status: { not: CompanyStatusType.DELETED },
      },
    });

    if (!company) {
      throw new HttpException('Registro inválido.', HttpStatus.BAD_REQUEST);
    }

    const jwt = GeneralUtils.generateJwt({
      userId: authentication.user.id,
      companyId: company.id,
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
      company: new CompanyEntity(company),
    };
  }
}
