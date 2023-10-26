import {
  ArrayDecorator,
  BooleanDecorator,
  EnumDecorator,
  ImageArrayDecorator,
  NumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { ProductStatusType, ProductType } from '@prisma/client';
import { AttributeDto } from './attribute.dto';

export class UpdateProductDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  label?: string;

  @StringDecorator({ required: false, empty: true })
  description?: string;

  @BooleanDecorator({ required: false })
  unlimited?: boolean;

  @NumberDecorator({ min: 0, required: false, empty: true })
  quantity?: number;

  @StringDecorator({ required: false, empty: true })
  quantitySulfix?: string;

  @BooleanDecorator()
  showPrice: boolean;

  @NumberDecorator({ min: 0, required: false })
  price?: number;

  @NumberDecorator({ min: 0, required: false })
  discountPrice?: number;

  @StringDecorator({ required: false })
  sku?: string;

  @StringDecorator({ required: false })
  barcode?: string;

  @ArrayDecorator({ type: String, required: false })
  videos?: string[];

  @ImageArrayDecorator({ required: false })
  pictures?: string[];

  @StringDecorator({ required: false, empty: true })
  width?: string;

  @StringDecorator({ required: false, empty: true })
  height?: string;

  @StringDecorator({ required: false, empty: true })
  length?: string;

  @StringDecorator({ required: false, empty: true })
  weight?: string;

  @ArrayDecorator({ type: AttributeDto, required: false })
  attributes?: AttributeDto[];

  @EnumDecorator({ enumType: ProductType, required: false })
  type?: ProductType;

  @ArrayDecorator({ type: String })
  categories: string[];

  @EnumDecorator({ enumType: ProductStatusType, required: false })
  status?: ProductStatusType;
}
