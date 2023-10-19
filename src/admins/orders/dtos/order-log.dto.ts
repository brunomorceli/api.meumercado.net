import { EnumDecorator, NumberDecorator, StringDecorator } from '@App/shared';
import { CreditCardType, OrderStatus } from '@prisma/client';

export class OrderLogDto {
  @NumberDecorator()
  id: number;

  @StringDecorator()
  observation: string;

  @EnumDecorator({ enumType: OrderStatus })
  status: OrderStatus;

  @EnumDecorator({ enumType: CreditCardType, required: false })
  createdAt: string;
}
