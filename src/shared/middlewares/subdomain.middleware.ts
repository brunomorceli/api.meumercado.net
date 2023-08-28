import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GeneralUtils } from '../utils';

@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.locals.subdomain = GeneralUtils.getSubdomain(req.headers.origin);
    next();
  }
}
