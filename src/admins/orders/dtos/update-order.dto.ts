import { EnumDecorator, StringDecorator } from '@App/shared';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @EnumDecorator({ enumType: OrderStatus })
  status: OrderStatus;

  @StringDecorator({ required: false, empty: true })
  observation?: string;
}
