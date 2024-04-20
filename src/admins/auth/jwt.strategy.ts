import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationStatusType } from '@prisma/client';
import { PrismaService } from '@App/shared/modules/prisma';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'admins') {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
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
        select: {
          user: {
            where: { id: userId },
            include: {
              company: {
                include: {
                  companyPlans: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!auth || !auth.user || !auth.user.company) {
      throw new UnauthorizedException();
    }

    return auth.user;
  }
}
