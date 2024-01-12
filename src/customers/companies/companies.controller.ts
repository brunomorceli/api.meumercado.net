import { Controller, Get, Res } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ApiTags } from '@nestjs/swagger';
import { CompanyEntity } from './entities/company.entity';
import { Public } from '../auth';

@ApiTags('customers/companies')
@Controller('customers/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  get(@Res({ passthrough: true }) res): Promise<CompanyEntity> {
    return this.companiesService.get(res.locals.tenantId);
  }

  @Public()
  @Get('/manifest.json')
  async manifest(@Res({ passthrough: true }) res): Promise<any> {
    const { tenantId } = res.locals;

    const content = {
      short_name: 'Meumercado',
      name: 'Meumercado',
      icons: [
        {
          src: 'favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon',
        },
        {
          src: 'logo192.png',
          type: 'image/png',
          sizes: '192x192',
        },
        {
          src: 'logo512.png',
          type: 'image/png',
          sizes: '512x512',
        },
      ],
      start_url: '.',
      display: 'standalone',
      theme_color: '#000000',
      background_color: '#ffffff',
    };

    if (tenantId) {
      const company = await this.companiesService.get(tenantId);
      if (company) {
        content.short_name = company.name;
        content.name = company.name;
      }
    }

    res.type('application/javascript');
    res.send(JSON.stringify(content));
  }
}
