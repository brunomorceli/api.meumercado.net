import { PaginationDto, StringDecorator, UuidDecorator } from '@App/shared';

export class FindProductDto extends PaginationDto {
  @UuidDecorator({ required: false })
  categoryId?: string;

  @StringDecorator({ required: false, minLength: 3 })
  label?: string;
}
