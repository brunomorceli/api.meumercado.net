import {
  EnumDecorator,
  HexacolorDecorator,
  PaginationDto,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { CategoryStatusType } from '@prisma/client';

export class FindCategoryDto extends PaginationDto {
  @UuidDecorator({ description: 'Parent ID', required: false })
  parentId?: string;

  @StringDecorator({ required: false })
  label?: string;

  @HexacolorDecorator({ required: false })
  color?: string;

  @EnumDecorator({
    enumType: CategoryStatusType,
    description: 'Category status',
    required: false,
  })
  status?: CategoryStatusType;
}
