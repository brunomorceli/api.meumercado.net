import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PagarmeService } from '../modules';
import { Subscription } from '@prisma/client';
import { AuthService } from '@App/admins/auth/auth.service';

@Injectable()
export class PlanMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly pagarmeService: PagarmeService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (token.length === 0) {
      return next();
    }

    const { userId } = this.jwtService.verify(token, {
      secret: process.env.ADMIN_JWT_SECRET,
    });

    const subscription: Subscription = await this.authService.getSubscription(
      userId,
    );

    if (!subscription) {
      return next();
    }

    res.locals.subscription = subscription;

    const now = new Date();
    if (subscription.expiredAt.getTime() < now.getTime()) {
      const whitelist = ['/admins/companies', '/admins/plans'];
      if (whitelist.filter((i) => req.baseUrl.includes(i)).length === 0) {
        throw new HttpException(null, HttpStatus.PAYMENT_REQUIRED);
      }
    }

    next();
  }
}
