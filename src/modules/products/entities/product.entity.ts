import {
  DateDecorator,
  EnumDecorator,
  ImageDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { Product, ProductStatusType } from '@prisma/client';

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

  @ImageDecorator({ required: false })
  cover?: string;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  constructor(data: Product | any) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}
