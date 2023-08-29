import {
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

  @UuidDecorator()
  categoryId: string;

  @StringDecorator()
  label: string;

  @StringDecorator({ required: false })
  description?: string;

  @BooleanDecorator()
  unlimited: boolean;

  @NumberDecorator({ min: 1 })
  quantity: number;

  @NumberDecorator({ min: 0 })
  price: number;

  @EnumDecorator({
    enumType: ProductStatusType,
    required: false,
    default: ProductStatusType.ACTIVE,
  })
  status?: ProductStatusType;

  @ImageDecorator({ required: false })
  cover?: string;
}
