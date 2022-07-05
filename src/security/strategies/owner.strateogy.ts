import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

import { UsersService } from '@App/users';

@Injectable()
export class OwnerStrategy extends PassportStrategy(Strategy, 'owner') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: any): Promise<any> {
    const { userId, validateAt } = payload;
    const user = await this.usersService.checkAuth(userId, validateAt);
    if (!user || user.id !== user.ownerId) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
