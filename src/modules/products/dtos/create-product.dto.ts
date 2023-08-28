import { EnumDecorator, ImageDecorator, StringDecorator } from '@App/shared';
import { ProductStatusType } from '@prisma/client';

export class CreateProductDto {
  @StringDecorator()
  label: string;

  @StringDecorator({ required: false })
  description?: string;

  @EnumDecorator({
    enumType: ProductStatusType,
    required: false,
    default: ProductStatusType.ACTIVE,
  })
  status?: ProductStatusType;

  @ImageDecorator({ required: false })
  cover?: string;
}
