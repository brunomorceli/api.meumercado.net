import { EnumDecorator, NumberDecorator, StringDecorator } from '@App/shared';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @NumberDecorator()
  id: number;

  @EnumDecorator({ enumType: OrderStatus })
  status: OrderStatus;

  @StringDecorator({ required: false })
  observation?: string;
}
