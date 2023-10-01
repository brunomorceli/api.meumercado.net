import { PaginationDto, StringDecorator, UuidDecorator } from '@App/shared';

export class FindProductDto extends PaginationDto {
  @UuidDecorator({ required: false })
  clientId?: string;

  @UuidDecorator({ required: false })
  categoryId?: string;

  @UuidDecorator({ required: false })
  companyId?: string;

  @StringDecorator({ required: false, minLength: 3 })
  label?: string;
}
