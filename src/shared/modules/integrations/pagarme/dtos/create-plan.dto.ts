import {
  ArrayDecorator,
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
} from '@App/shared/decorators';
import {
  EPaymentBillingType,
  EPaymentInterval,
  EPaymentMethod,
} from '../enums';

export class CreatePlanDto {
  @StringDecorator()
  name: string;

  @StringDecorator()
  description: string;

  @StringDecorator()
  statementDescriptor: string;

  @NumberDecorator()
  price: number;

  @ArrayDecorator({ type: String, required: false })
  paymentMethods?: Array<EPaymentMethod>;

  @EnumDecorator({ enumType: EPaymentInterval, required: false })
  interval?: EPaymentInterval;

  @NumberDecorator({ required: false })
  intervalCount?: number;

  @NumberDecorator({ required: false })
  trialPeriodDays?: number;

  @EnumDecorator({ enumType: EPaymentBillingType, required: false })
  billingType: EPaymentBillingType;

  static toJson(data: CreatePlanDto): any {
    return {
      name: data.name,
      description: data.description,
      statement_descriptor: data.statementDescriptor,
      price: data.price,
      payment_methods: data.paymentMethods || ['credit_card'],
      shippable: false,
      currency: 'BRL',
      interval: data.interval || EPaymentInterval.MONTH,
      interval_count: data.intervalCount || 1,
      trial_period_days: data.trialPeriodDays || 7,
      billing_type: data.billingType || EPaymentBillingType.PREPAID,
      pricing_scheme: { schemeType: 'unit', price: data.price },
      quantity: 1,
      items: [],
      installments: [],
      billing_days: [],
      metadata: {},
    };
  }
}
