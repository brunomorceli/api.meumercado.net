import {
  ArrayDecorator,
  DateDecorator,
  EnumDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { OrderProductDto } from '../dtos/order-product.dto';
import { OrderPaymentDto } from '../dtos/order-payment.dto';
import { Order, OrderStatus } from '@prisma/client';
import { OrderLogDto } from '@App/customers/orders/dtos/order-log.dto';

export class OrderEntity {
  @UuidDecorator()
  id: string;

  @UuidDecorator()
  userId: string;

  @UuidDecorator()
  companyId: string;

  @EnumDecorator({ enumType: OrderStatus })
  status: OrderStatus;

  @StringDecorator({ required: false })
  observation?: string;

  @ArrayDecorator({ type: OrderProductDto })
  products: OrderProductDto[];

  payments: OrderPaymentDto[];

  @ArrayDecorator({ type: OrderLogDto })
  orderLogs: OrderLogDto[];

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @DateDecorator({ description: 'Deleting date.', required: false })
  deletedAt?: string;

  constructor(data: Order) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}