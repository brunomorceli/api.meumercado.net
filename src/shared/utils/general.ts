import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtResult } from './dtos';

@Injectable()
export class GeneralUtils {
  private static jwtService;

  private static getJwtService() {
    if (!this.jwtService) {
      this.jwtService = new JwtService();
    }

    return this.jwtService;
  }

  public static generateValidationCode(size = 7): string {
    const characters = 'abcdefghijklmnopqrstuvxyz12345678901234567890';
    let result = '';
    for (let i = 0; i < size; i = i + 1) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }

  public static generateJwt(tokenData: any): JwtResult {
    const createdAt: string = new Date().toISOString();
    const tokenOptions = { secret: process.env.JWT_SECRET };
    const payload = { ...tokenData, createdAt };
    const token = this.getJwtService().sign(payload, tokenOptions);

    return { createdAt, token } as JwtResult;
  }

  public static getSubdomain(url: string): string {
    let domain = url;
    if (url.includes('://')) {
      domain = url.split('://')[1];
    }

    if (domain.indexOf('www')) {
      domain = domain.replace('wwww', '');
    }

    const subdomain = domain.split('.')[0];
    return subdomain;
  }
}
