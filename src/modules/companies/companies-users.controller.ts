import {
  Controller,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Req,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateCompanyUserDto,
  FindCompanyUserDto,
  UpdateCompanyUserDto,
} from './dtos';
import { IdParamDto } from '@App/shared';
import { CompanyUserEntity } from './entities';
import { FindCompanyUserResultDto } from './dtos/company-users/find-company-user-result.dto';

@ApiTags('companies/users')
@ApiBearerAuth('access-token')
@Controller('companies/users')
export class CompaniesUsersController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Patch()
  post(
    @Req() req: any,
    @Body() data: CreateCompanyUserDto,
  ): Promise<CompanyUserEntity> {
    return this.companiesService.createUser(req.user.company.id, data);
  }

  @Patch()
  update(
    @Req() req: any,
    @Body() data: UpdateCompanyUserDto,
  ): Promise<CompanyUserEntity> {
    return this.companiesService.updateUser(req.user.company.id, data);
  }

  @Get(':id/get')
  get(@Req() req: any, @Param() props: IdParamDto): Promise<CompanyUserEntity> {
    return this.companiesService.getUser(req.user.company.id, props.id);
  }

  @Get('find')
  find(
    @Req() req: any,
    @Query() findCompanyDto: FindCompanyUserDto,
  ): Promise<FindCompanyUserResultDto> {
    return this.companiesService.findUser(req.user.company.id, findCompanyDto);
  }

  @Delete(':id/get')
  async delete(@Req() req: any, @Param() props: IdParamDto): Promise<void> {
    await this.companiesService.deleteUser(req.user.company.id, props.id);
  }
}
