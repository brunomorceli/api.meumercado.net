import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthenticationStatusType, RoleType } from '@prisma/client';
import { PrismaService, MessagesService } from '@App/shared/modules';
import { GeneralUtils } from '@App/shared';
import { SignupDto } from './dtos/signup.dto';
import { CompaniesService } from '../companies';
import {
  ConfirmDto,
  ConfirmResponseDto,
  SigninDto,
  SigninResponseDto,
} from './dtos';

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

  async signup(signupDto: SignupDto): Promise<void> {
    await this.companiesService.create({
      email: signupDto.email,
      companyName: signupDto.label,
      userFirstName: signupDto.firstName,
      userLastName: signupDto.lastName,
    });
  }

  async signin(signinDto: SigninDto): Promise<SigninResponseDto> {
    const { email } = signinDto;

    const user = await this.prismaService.user.findFirst({
      where: {
        email,
        role: { in: [RoleType.OWNER, RoleType.MEMBER, RoleType.SUPPLIER] },
      },
      include: { company: true },
    });

    if (!user || !user.company) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }

    const auth = await this.prismaService.$transaction(async (prisma) => {
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

      return auth;
    });

    return Promise.resolve({
      tenantId: user.company.tenantId,
      authId: auth.id,
    });
  }

  async confirm(confirmDto: ConfirmDto): Promise<ConfirmResponseDto> {
    const now = new Date();
    const { confirmationCode, authId } = confirmDto;

    const authentication = await this.prismaService.authentication.findFirst({
      where: {
        id: authId,
        confirmationCode,
        status: AuthenticationStatusType.PENDING,
        confirmationExpiredAt: { gt: now },
      },
      include: {
        user: {
          include: { company: true },
        },
      },
    });

    if (!authentication) {
      throw new HttpException('Registro inválido.', HttpStatus.BAD_REQUEST);
    }

    const user = authentication.user;
    const jwt = GeneralUtils.generateJwt({
      userId: authentication.user.id,
      companyId: user.company.id,
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
      token: jwt.token,
      userName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      companyId: user.company.id,
      tenantId: user.company.tenantId,
      companyName: user.company.name,
      logo: user.company.logo,
    };
  }
}
