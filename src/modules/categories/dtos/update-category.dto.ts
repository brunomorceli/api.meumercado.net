import {
  EnumDecorator,
  HexacolorDecorator,
  HexadecimalDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { CategoryStatusType } from '@prisma/client';

export class UpdateCategoryDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  label?: string;

  @HexacolorDecorator({ required: false })
  color?: string;

  @HexadecimalDecorator({ description: 'Image cover', required: false })
  blob?: string;

  @EnumDecorator({ enumType: CategoryStatusType, required: false })
  status?: CategoryStatusType;
}
