import { EnumDecorator, StringDecorator } from '@App/shared/decorators';
import { EPaymentMethod } from '../enums';

export class CreateSubscriptionDto {
  @StringDecorator()
  code: string; // internal id from your project

  @StringDecorator()
  planId: string;

  @StringDecorator()
  cardId: string;

  @EnumDecorator({ enumType: EPaymentMethod })
  paymentMethod: EPaymentMethod;

  static toJson(customerId: string, data: CreateSubscriptionDto): any {
    return {
      code: data.code,
      plan_id: data.planId,
      customer_id: customerId,
      card_id: data.cardId,
      payment_methods: data.paymentMethod,
    };
  }
}
