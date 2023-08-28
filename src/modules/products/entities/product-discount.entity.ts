import {
  DateTimeDecorator,
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { ProductDiscount, ProductStatusType } from '@prisma/client';

export class ProductDiscountEntity {
  @UuidDecorator()
  id: string;

  @UuidDecorator()
  productId: string;

  @StringDecorator()
  label: string;

  @StringDecorator()
  slug: string;

  @NumberDecorator()
  minPerOrder: number;

  @NumberDecorator()
  maxPerOrder: number;

  @NumberDecorator({ description: 'Price in cents.' })
  price: number;

  @EnumDecorator({
    enumType: ProductStatusType,
    default: ProductStatusType.ACTIVE,
  })
  status: ProductStatusType;

  @DateTimeDecorator()
  expireAt: string;

  constructor(data: ProductDiscount) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}
