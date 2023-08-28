import {
  EnumDecorator,
  PaginationDto,
  SlugDecorator,
  UuidDecorator,
} from '@App/shared';
import { CompanyProductStatusType } from '@prisma/client';

export class FindCompanyProductDto extends PaginationDto {
  @SlugDecorator({ required: false, minLength: 3 })
  slug?: string;

  @UuidDecorator({ required: false })
  companyId?: string;

  @EnumDecorator({
    enumType: CompanyProductStatusType,
    description: 'Product status',
    required: false,
  })
  status?: CompanyProductStatusType;
}
