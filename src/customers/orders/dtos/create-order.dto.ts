import { ArrayDecorator, StringDecorator } from '@App/shared';
import { CreateOrderProductDto } from './create-order-product.dto';
import { CreateOrderPaymentDto } from './create-order-payment.dto';

export class CreateOrderDto {
  @ArrayDecorator({ type: CreateOrderProductDto })
  products: CreateOrderProductDto[];

  @ArrayDecorator({ type: CreateOrderPaymentDto })
  payments: CreateOrderPaymentDto[];

  @StringDecorator({ required: false })
  observation?: string;
}
