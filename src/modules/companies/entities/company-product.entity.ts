import {
  DateDecorator,
  EnumDecorator,
  NumberDecorator,
  ObjectDecorator,
  UuidDecorator,
} from '@App/shared';
import { CompanyProductStatusType } from '@prisma/client';
import { ProductEntity } from '@App/modules/products';
import { CategoryEntity } from '@App/modules/categories';

export class CompanyProductEntity {
  @UuidDecorator()
  id: string;

  @NumberDecorator()
  quantity: number;

  @NumberDecorator()
  price: number;

  @EnumDecorator({ enumType: CompanyProductStatusType })
  status: CompanyProductStatusType;

  @UuidDecorator()
  companyId: string;

  @ObjectDecorator({ type: ProductEntity })
  product: ProductEntity;

  @ObjectDecorator({ type: CategoryEntity })
  category: CategoryEntity;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @DateDecorator({ description: 'Deleting date.', required: false })
  deletedAt?: string;

  constructor(data: any) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));

    this.product = new ProductEntity(data.product);
    this.category = new CategoryEntity(data.categories);
  }
}
