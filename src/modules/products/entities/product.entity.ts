import {
  DateDecorator,
  EnumDecorator,
  StringDecorator,
  UrlDecorator,
  UuidDecorator,
} from '@App/shared';
import { Product, ProductStatusType } from '@prisma/client';
import { ProductDiscountEntity } from './product-discount.entity';

export class ProductEntity {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  label: string;

  @StringDecorator({ required: false })
  description?: string;

  @StringDecorator()
  slug: string;

  @EnumDecorator({
    enumType: ProductStatusType,
    default: ProductStatusType.ACTIVE,
  })
  status: ProductStatusType;

  @UrlDecorator({ description: 'Image URL.', required: false })
  cover?: string;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @EnumDecorator({ enumType: ProductDiscountEntity, required: false })
  discount?: ProductDiscountEntity;

  constructor(data: Product | any) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
    if (data.discounts && data.discounts.length !== 0) {
      this.discount = data.discounts[0];
    }
  }
}
