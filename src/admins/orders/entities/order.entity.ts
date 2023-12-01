import {
  ArrayDecorator,
  DateDecorator,
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { OrderProductDto } from '../dtos/order-product.dto';
import { OrderPaymentDto } from '../dtos/order-payment.dto';
import { DeliveryType, Order, OrderStatus } from '@prisma/client';
import { OrderLogDto } from '@App/customers/orders/dtos/order-log.dto';
import { UserEntity } from '@App/admins/users';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class OrderEntity {
  @NumberDecorator()
  id: number;

  @UuidDecorator()
  userId: UserEntity;

  @Type(() => UserEntity)
  @IsOptional()
  user?: UserEntity;

  @UuidDecorator()
  companyId: string;

  @EnumDecorator({ enumType: OrderStatus })
  status: OrderStatus;

  @EnumDecorator({ enumType: DeliveryType })
  deliveryType: DeliveryType;

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

  constructor(data: Order | any) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));

    if (data.user) {
      this.user = new UserEntity(data.user);
    }
  }

  static getLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Aguardando resposta';
      case OrderStatus.PREPARING:
        return 'Em preparo';
      case OrderStatus.SHIPPING:
        return 'Em trânsito';
      case OrderStatus.DELIVERING:
        return 'Rota de entrega';
      case OrderStatus.DONE:
        return 'Entregue';
      case OrderStatus.CANCELED_BY_COMPANY:
        return 'Cancelado pelo estabelecimento';
      case OrderStatus.CANCELED_BY_CLIENT:
        return 'Cancelado pelo cliente';
    }
  }
}
