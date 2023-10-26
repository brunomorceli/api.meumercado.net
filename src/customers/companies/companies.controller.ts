import { Controller, Get, Res } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ApiTags } from '@nestjs/swagger';
import { CompanyEntity } from './entities/company.entity';

@ApiTags('customers/companies')
@Controller('customers/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  get(@Res({ passthrough: true }) res): Promise<CompanyEntity> {
    return this.companiesService.get(res.locals.tenantId);
  }
}
