import {
  ArrayDecorator,
  BooleanDecorator,
  DateDecorator,
  EnumDecorator,
  ImageArrayDecorator,
  NumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { Product, ProductStatusType, ProductType } from '@prisma/client';
import { AttributeDto } from '../dtos';

export class ProductEntity {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  label: string;

  @StringDecorator({ required: false })
  description?: string;

  @StringDecorator()
  slug: string;

  @BooleanDecorator()
  unlimited: boolean;

  @NumberDecorator({ min: 1 })
  quantity: number;

  @StringDecorator({ required: false, empty: true })
  quantitySulfix?: string;

  @BooleanDecorator()
  showPrice: boolean;

  @NumberDecorator({ min: 0 })
  price: number;

  @NumberDecorator({ required: false })
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

  @UuidDecorator()
  companyId: string;

  @ArrayDecorator({ type: String })
  category: string[];

  @EnumDecorator({
    enumType: ProductStatusType,
    default: ProductStatusType.ACTIVE,
  })
  status: ProductStatusType;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @DateDecorator({ description: 'Delete date.', required: false })
  deletedAt?: string;

  constructor(data: Product | any) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}
