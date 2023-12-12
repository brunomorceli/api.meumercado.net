import { PaginationDto, StringDecorator } from '@App/shared';

export class FindProductBaseDto extends PaginationDto {
  @StringDecorator({ required: false, minLength: 3 })
  label?: string;
}
