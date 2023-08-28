import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthenticateUserDto,
  ConfirmAuthenticationDto,
  ConfirmAuthenticationResponseDto,
} from './dtos';
import { Public } from '@App/shared/modules/auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('authenticate')
  @Public()
  authenticate(
    @Body() authenticateUserDto: AuthenticateUserDto,
  ): Promise<void> {
    return this.usersService.authenticate(authenticateUserDto);
  }

  @Post('confirm')
  @Public()
  confirm(
    @Body() confirmAuthenticationDto: ConfirmAuthenticationDto,
  ): Promise<ConfirmAuthenticationResponseDto> {
    return this.usersService.confirmAuthentication(confirmAuthenticationDto);
  }
}
