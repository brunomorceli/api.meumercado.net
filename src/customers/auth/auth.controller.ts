import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import {
  ConfirmDto,
  ConfirmResponseDto,
  SigninDto,
  SigninResponseDto,
  SignupDto,
} from './dtos';
import { Public } from '@App/customers/auth/jwt-auth.guard';

@ApiTags('customers/auth')
@Controller('customers/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Public()
  signin(
    @Res({ passthrough: true }) res,
    @Body() signinDto: SigninDto,
  ): Promise<SigninResponseDto> {
    return this.authService.signin(res.locals.tenantId, signinDto);
  }

  @Post('signup')
  @Public()
  signup(
    @Res({ passthrough: true }) res,
    @Body() signinDto: SignupDto,
  ): Promise<void> {
    return this.authService.signup(res.locals.tenantId, signinDto);
  }

  @Post('confirm/')
  @Public()
  confirm(@Body() confirmDto: ConfirmDto): Promise<ConfirmResponseDto> {
    return this.authService.confirm(confirmDto);
  }
}
