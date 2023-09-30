import {
  Controller,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Req,
  Delete,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, FindUserDto, UpdateUserDto } from './dtos';
import { IdParamDto } from '@App/shared';
import { UserEntity } from './entities';
import { FindUserResultDto } from './dtos/find-user-result.dto';
import { UsersService } from './users.service';

@ApiTags('admins/users')
@ApiBearerAuth('access-token')
@Controller('admins/users')
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

  @Get('find')
  find(
    @Req() req: any,
    @Query() query: FindUserDto,
  ): Promise<FindUserResultDto> {
    return this.usersService.find(req.user.company.id, query);
  }

  @Delete(':id/get')
  delete(@Req() req: any, @Param() params: IdParamDto): Promise<void> {
    return this.usersService.delete(req.user.company.id, params.id);
  }
}
