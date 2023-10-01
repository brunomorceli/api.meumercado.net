import { ArrayDecorator, StringDecorator } from '@App/shared';
import { CreateOrderProductDto } from './create-order-product.dto';
import { CreateOrderPaymentDto } from './create-order-payment.dto';

export class CreateOrderDto {
  @StringDecorator()
  userId: string;

  @ArrayDecorator({ type: CreateOrderProductDto })
  products: CreateOrderProductDto[];

  payments: CreateOrderPaymentDto[];

  @StringDecorator({ required: false })
  observation?: string;
}
