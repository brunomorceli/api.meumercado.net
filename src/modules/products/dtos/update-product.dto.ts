import {
  EnumDecorator,
  ImageDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { ProductStatusType } from '@prisma/client';

export class UpdateProductDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  label?: string;

  @StringDecorator({ required: false })
  description?: string;

  @ImageDecorator({ required: false })
  cover?: string;

  @EnumDecorator({ enumType: ProductStatusType, required: false })
  status?: ProductStatusType;
}
