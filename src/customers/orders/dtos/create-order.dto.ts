import { ArrayDecorator, EnumDecorator, StringDecorator } from '@App/shared';
import { CreateOrderProductDto } from './create-order-product.dto';
import { CreateOrderPaymentDto } from './create-order-payment.dto';
import { DeliveryType } from '@prisma/client';

export class CreateOrderDto {
  @ArrayDecorator({ type: CreateOrderProductDto })
  orderProducts: CreateOrderProductDto[];

  @ArrayDecorator({ type: CreateOrderPaymentDto })
  payments: CreateOrderPaymentDto[];

  @EnumDecorator({ enumType: DeliveryType })
  deliveryType: DeliveryType;

  @StringDecorator({ required: false })
  observation?: string;
}
