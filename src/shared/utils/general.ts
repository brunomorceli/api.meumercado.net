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

  public static generateJwt(tokenData: any, secret: string): JwtResult {
    const createdAt: string = new Date().toISOString();
    const tokenOptions = { secret };
    const payload = { ...tokenData, createdAt };
    const token = this.getJwtService().sign(payload, tokenOptions);

    return { createdAt, token } as JwtResult;
  }

  public static getTenantId(url: string): string {
    let domain = url;
    if (url.includes('://')) {
      domain = url.split('://')[1];
    }

    if (domain.indexOf('www')) {
      domain = domain.replace('wwww', '');
    }

    const tenantId = domain.split('.')[0];
    return tenantId;
  }

  public static shuffle(array: any[]): any[] {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  public static generateShuffleArray(numOfElements: number): number[] {
    return this.shuffle(Array.from(Array(numOfElements).keys()));
  }
}
