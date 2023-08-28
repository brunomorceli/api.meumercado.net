import {
  EnumDecorator,
  NumberDecorator,
  PaginationDto,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { ProductStatusType } from '@prisma/client';

export class FindProductDto extends PaginationDto {
  @UuidDecorator({ description: 'Parent ID', required: false })
  parentId?: string;

  @StringDecorator({ required: false, minLength: 3 })
  label?: string;

  @EnumDecorator({
    enumType: ProductStatusType,
    description: 'Product status',
    required: false,
  })
  status?: ProductStatusType;

  @NumberDecorator({ required: false })
  page?: number;

  @NumberDecorator({ required: false })
  size?: number;
}
