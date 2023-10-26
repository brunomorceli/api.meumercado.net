import { Controller, Body, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos';
import { UserEntity } from './entities';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('customers/users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('customers'))
@Controller('customers/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  update(@Req() req: any, @Body() body: UpdateUserDto): Promise<UserEntity> {
    return this.usersService.update(req.user, body);
  }

  @Get('self')
  get(@Req() req: any): Promise<UserEntity> {
    return this.usersService.get(req.user.id);
  }
}
