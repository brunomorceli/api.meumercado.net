import {
  ArrayDecorator,
  BooleanDecorator,
  EnumDecorator,
  ImageDecorator,
  NumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { ProductStatusType } from '@prisma/client';

export class CreateProductDto {
  @UuidDecorator()
  companyId: string;

  @ArrayDecorator({ type: String })
  categories: string[];

  @StringDecorator()
  label: string;

  @StringDecorator({ required: false })
  description?: string;

  @BooleanDecorator()
  unlimited: boolean;

  @NumberDecorator({ required: false })
  quantity?: number;

  @NumberDecorator({ min: 0 })
  price: number;

  @NumberDecorator({ required: false })
  discountPrice?: number;

  @StringDecorator({ required: false })
  sku?: string;

  @StringDecorator({ required: false })
  barcode?: string;

  @EnumDecorator({
    enumType: ProductStatusType,
    required: false,
    default: ProductStatusType.ACTIVE,
  })
  status?: ProductStatusType;

  @ImageDecorator({ required: false })
  cover?: string;
}
