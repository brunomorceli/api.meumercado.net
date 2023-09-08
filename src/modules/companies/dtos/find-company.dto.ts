import {
  EnumDecorator,
  PaginationDto,
  SlugDecorator,
  StringDecorator,
  TenantIdDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared';
import { CompanyStatusType } from '@prisma/client';

export class FindCompanyDto extends PaginationDto {
  @UuidDecorator({ required: false })
  ownerId?: string;

  @SlugDecorator({ required: false, minLength: 3 })
  label?: string;

  @TenantIdDecorator({ required: false })
  tenantId?: string;

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
