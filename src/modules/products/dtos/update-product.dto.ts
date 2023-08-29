import {
  BooleanDecorator,
  EnumDecorator,
  ImageDecorator,
  NumberDecorator,
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

  @BooleanDecorator({ required: false })
  unlimited?: boolean;

  @NumberDecorator({ min: 1, required: false })
  quantity?: number;

  @NumberDecorator({ min: 0, required: false })
  price?: number;

  @ImageDecorator({ required: false })
  cover?: string;

  @UuidDecorator({ required: false })
  categoryId?: string;

  @EnumDecorator({ enumType: ProductStatusType, required: false })
  status?: ProductStatusType;
}
