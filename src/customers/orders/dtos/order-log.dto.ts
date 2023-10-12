import { EnumDecorator, StringDecorator, UuidDecorator } from '@App/shared';
import { CreditCardType, OrderStatus } from '@prisma/client';

export class OrderLogDto {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  observation: string;

  @EnumDecorator({ enumType: OrderStatus })
  status: OrderStatus;

  @EnumDecorator({ enumType: CreditCardType, required: false })
  createdAt: string;
}
