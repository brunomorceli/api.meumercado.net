import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GeneralUtils } from '../utils';

@Injectable()
export class TenantIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.locals.tenantId = GeneralUtils.getTenantId(req.headers.origin || '');
    next();
  }
}
