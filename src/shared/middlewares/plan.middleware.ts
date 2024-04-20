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
import { AuthService } from '@App/admins/auth/auth.service';
import { CompanyPlan } from '@prisma/client';

@Injectable()
export class PlanMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (token.length === 0) {
      return next();
    }

    const { companyId } = this.jwtService.verify(token, {
      secret: process.env.ADMIN_JWT_SECRET,
    });

    const companyPlan: CompanyPlan = await this.authService.getCompanyPlan(
      companyId,
    );

    if (!companyPlan) {
      return next();
    }

    const whitelist = ['/admins/companies', '/admins/plans'];
    const now = new Date();
    if (companyPlan.expiredAt.getTime() < now.getTime()) {
      if (whitelist.filter((i) => req.baseUrl.includes(i)).length === 0) {
        throw new HttpException(null, HttpStatus.PAYMENT_REQUIRED);
      }
    }

    next();
  }
}
