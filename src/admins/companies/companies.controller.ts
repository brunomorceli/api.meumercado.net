import { Controller, Body, Get, Param, Query, Patch } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindCompanyDto, FindCompanyResultDto, UpdateCompanyDto } from './dtos';
import { CompanyEntity } from './entities/company.entity';
import { IdParamDto, Public } from '@App/shared';

@ApiTags('companies')
@ApiBearerAuth('access-token')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Patch()
  update(@Body() updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity> {
    return this.companiesService.update(updateCompanyDto);
  }

  @Public()
  @Get(':id/get')
  get(@Param() props: IdParamDto): Promise<CompanyEntity> {
    return this.companiesService.get(props.id);
  }

  @Public()
  @Get('find')
  find(@Query() findCompanyDto: FindCompanyDto): Promise<FindCompanyResultDto> {
    return this.companiesService.find(findCompanyDto);
  }
}
