import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ConfirmDto,
  ConfirmResponseDto,
  SigninDto,
  SigninResponseDto,
  SignupDto,
} from './dtos';
import { Public } from '@App/admins/auth/jwt-auth.guard';

@ApiTags('admins/auth')
@ApiBearerAuth('access-token')
@Controller('admins/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Public()
  signin(@Body() signinDto: SigninDto): Promise<SigninResponseDto> {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  @Public()
  signup(@Body() signinDto: SignupDto): Promise<void> {
    return this.authService.signup(signinDto);
  }

  @Post('confirm/')
  @Public()
  confirm(
    //@Res({ passthrough: true }) res,
    @Body() confirmDto: ConfirmDto,
  ): Promise<ConfirmResponseDto> {
    return this.authService.confirm(confirmDto);
  }
}
