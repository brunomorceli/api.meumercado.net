import {
  DateDecorator,
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
} from '@App/shared/decorators';
import { EPagarmeSubscriptionStatus, EPaymentMethod } from '../enums';
import { PlanDto } from './plan.dto';
import { Type } from 'class-transformer';
import { CardDto } from './card.dto';
import { CustomerDto } from './customer.dto';

export class SubscriptionDto {
  @StringDecorator()
  id: string;

  @StringDecorator()
  code: string;

  @Type(() => PlanDto)
  plan: PlanDto;

  @Type(() => CardDto)
  card: CardDto;

  @Type(() => CustomerDto)
  customer: CustomerDto;

  @EnumDecorator({ enumType: EPaymentMethod })
  paymentMethod: EPaymentMethod;

  @EnumDecorator({ enumType: EPagarmeSubscriptionStatus })
  status: EPagarmeSubscriptionStatus;

  @NumberDecorator()
  price: number;

  @StringDecorator()
  statementDecription: string;

  @DateDecorator()
  createdAt: string;

  @DateDecorator()
  startAt: string;

  @DateDecorator()
  nextBillingAt: string;

  @DateDecorator()
  cancelledAt: string;

  static fromJson(data: any): SubscriptionDto {
    return {
      id: data.id,
      code: data.code,
      plan: PlanDto.fromJson(data.plan),
      customer: CustomerDto.fromJson(data.customer),
      card: CardDto.fromJson(data.card),
      paymentMethod: data.payment_method,
      status: data.status,
      price: data.items[0].price,
      statementDecription: data.statement_descriptor,
      createdAt: data.created_at,
      startAt: data.start_at,
      nextBillingAt: data.next_billing_at,
      cancelledAt: data.canceled_at,
    };
  }
}
