import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthenticateUserDto,
  AuthenticateUserResponseDto,
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
  ): Promise<AuthenticateUserResponseDto> {
    return this.usersService.authenticate(authenticateUserDto);
  }

  @Post('confirm/')
  @Public()
  confirm(
    //@Res({ passthrough: true }) res,
    @Body() confirmAuthenticationDto: ConfirmAuthenticationDto,
  ): Promise<ConfirmAuthenticationResponseDto> {
    return this.usersService.confirmAuthentication(confirmAuthenticationDto);
  }
}
