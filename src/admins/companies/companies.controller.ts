import {
  Controller,
  Body,
  Get,
  Param,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindCompanyDto, FindCompanyResultDto, UpdateCompanyDto } from './dtos';
import { CompanyEntity } from './entities/company.entity';
import { IdParamDto } from '@App/shared';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('admins/companies')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('admins'))
@Controller('admins/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Patch()
  update(@Body() updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity> {
    return this.companiesService.update(updateCompanyDto);
  }

  @Get(':id/get')
  get(@Param() props: IdParamDto): Promise<CompanyEntity> {
    return this.companiesService.get(props.id);
  }

  @Get('find')
  find(@Query() findCompanyDto: FindCompanyDto): Promise<FindCompanyResultDto> {
    return this.companiesService.find(findCompanyDto);
  }
}
