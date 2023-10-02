import { AttributeDto } from '@App/admins';
import {
  ArrayDecorator,
  BooleanDecorator,
  EnumDecorator,
  ImageArrayDecorator,
  NumberDecorator,
  StringDecorator,
} from '@App/shared';
import { ProductStatusType, ProductType } from '@prisma/client';

export class CreateProductDto {
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

  @BooleanDecorator()
  showPrice: boolean;

  @NumberDecorator({ min: 0 })
  price: number;

  @NumberDecorator({ min: 0, required: false })
  discountPrice?: number;

  @StringDecorator({ required: false })
  sku?: string;

  @StringDecorator({ required: false })
  barcode?: string;

  @ArrayDecorator({ type: String })
  videos: string[];

  @ImageArrayDecorator()
  pictures: string[];

  @StringDecorator({ required: false })
  width?: string;

  @StringDecorator({ required: false })
  height?: string;

  @StringDecorator({ required: false })
  length?: string;

  @StringDecorator({ required: false })
  weight?: string;

  @ArrayDecorator({ type: AttributeDto })
  attributes: AttributeDto[];

  @EnumDecorator({ enumType: ProductType })
  type: ProductType;

  @EnumDecorator({
    enumType: ProductStatusType,
    required: false,
    default: ProductStatusType.ACTIVE,
  })
  status?: ProductStatusType;
}