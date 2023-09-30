import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationStatusType } from '@prisma/client';
import { PrismaService } from '@App/shared/modules/prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ADMIN_JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any): Promise<any> {
    const { userId, createdAt } = payload;

    if (!userId || !createdAt) {
      throw new UnauthorizedException();
    }

    let auth;
    try {
      auth = await this.prismaService.authentication.findFirst({
        where: {
          authenticatedAt: new Date(createdAt),
          status: AuthenticationStatusType.ACTIVE,
        },
        include: {
          user: {
            where: { id: userId },
            include: { company: true },
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!auth || !auth.user) {
      throw new UnauthorizedException();
    }

    return auth.user;
  }
}
