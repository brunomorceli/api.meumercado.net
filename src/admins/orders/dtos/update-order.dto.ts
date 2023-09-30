import { EnumDecorator, StringDecorator, UuidDecorator } from '@App/shared';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @UuidDecorator()
  id: string;

  @EnumDecorator({ enumType: OrderStatus })
  status: OrderStatus;

  @StringDecorator({ required: false })
  observation?: string;
}
