import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateCompanyDto,
  FindCompanyDto,
  FindCompanyResultDto,
  UpdateCompanyDto,
} from './dtos';
import { CompanyEntity } from './entities/company.entity';
import { IdParamDto, Public } from '@App/shared';

@ApiTags('companies')
@ApiBearerAuth('access-token')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @Req() req: any,
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyEntity> {
    return this.companiesService.create(req.user, createCompanyDto);
  }

  @Patch()
  update(
    @Req() req: any,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyEntity> {
    return this.companiesService.update(req.user, updateCompanyDto);
  }

  @Public()
  @Get(':id/get')
  get(props: IdParamDto): Promise<CompanyEntity> {
    return this.companiesService.get(props.id);
  }

  @Public()
  @Get('find')
  find(@Query() findCompanyDto: FindCompanyDto): Promise<FindCompanyResultDto> {
    return this.companiesService.find(findCompanyDto);
  }

  @Get('find-by-owner')
  findByOwner(@Req() req: any): Promise<FindCompanyResultDto> {
    return this.companiesService.findByOwner(req.user.ownerId);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param() props: IdParamDto): Promise<void> {
    return this.companiesService.delete(req.user, props.id);
  }
}
