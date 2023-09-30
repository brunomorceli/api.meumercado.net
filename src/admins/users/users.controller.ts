import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ConfirmDto,
  ConfirmResponseDto,
  SigninDto,
  SigninResponseDto,
  SignupDto,
} from './dtos';
import { Public } from '@App/shared/modules/auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signin')
  @Public()
  signin(@Body() signinDto: SigninDto): Promise<SigninResponseDto> {
    return this.usersService.signin(signinDto);
  }

  @Post('signup')
  @Public()
  signup(@Body() signinDto: SignupDto): Promise<void> {
    return this.usersService.signup(signinDto);
  }

  @Post('confirm/')
  @Public()
  confirm(
    //@Res({ passthrough: true }) res,
    @Body() confirmDto: ConfirmDto,
  ): Promise<ConfirmResponseDto> {
    return this.usersService.confirm(confirmDto);
  }
}
