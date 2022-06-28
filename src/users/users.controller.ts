import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import {
  UserAuthenticateDto,
  UserHandler,
  UsersService,
  UserValidateResponse,
  UserValidateDto,
} from '@App/users';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('self')
  self(@Req() req): User {
    const result = {};
    for (const key in UserHandler.getSafeFields()) {
      result[key] = req.user[key];
    }

    return result as unknown as User;
  }

  @Put('authenticate')
  async authenticate(
    @Body() authenticateDto: UserAuthenticateDto,
  ): Promise<UserValidateResponse | void> {
    try {
      return await this.usersService.authenticate(authenticateDto);
    } catch (error) {
      throw error;
    }
  }

  @Put('validate')
  async validate(
    @Body() userValidateDto: UserValidateDto,
  ): Promise<UserValidateResponse> {
    try {
      return await this.usersService.validateCode(userValidateDto);
    } catch (error) {
      throw error;
    }
  }
}
