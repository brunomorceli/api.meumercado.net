import {
  EnumDecorator,
  PaginationDto,
  SlugDecorator,
  StringDecorator,
  SubdomainDecorator,
  UFDecorator,
} from '@App/shared';
import { CompanyStatusType } from '@prisma/client';

export class FindCompanyDto extends PaginationDto {
  @SlugDecorator({ required: false, minLength: 3 })
  slug?: string;

  @SubdomainDecorator({ required: false })
  subdomain?: string;

  @StringDecorator({ required: false })
  address?: string;

  @StringDecorator({ required: false })
  neighborhood?: string;

  @StringDecorator({ required: false })
  city?: string;

  @UFDecorator({ required: false })
  state?: string;

  @EnumDecorator({
    enumType: CompanyStatusType,
    description: 'Company status',
    required: false,
  })
  status?: CompanyStatusType;
}
