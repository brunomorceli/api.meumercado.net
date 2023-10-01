import { Controller, Body, Get, Param, Patch, Req, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { IdParamDto } from '@App/shared';
import { UserEntity } from './entities';
import { UsersService } from './users.service';

@ApiTags('customers/users')
@ApiBearerAuth('access-token')
@Controller('customers/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Req() req: any, @Body() body: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(req.user.company.id, body);
  }

  @Patch()
  update(@Req() req: any, @Body() body: UpdateUserDto): Promise<UserEntity> {
    return this.usersService.update(req.user.company.id, body);
  }

  @Get(':id/get')
  get(@Req() req: any, @Param() params: IdParamDto): Promise<UserEntity> {
    return this.usersService.get(req.user.company.id, params.id);
  }
}
