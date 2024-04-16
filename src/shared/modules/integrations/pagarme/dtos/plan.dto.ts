import { GetPlanResponse } from '@pagarme/pagarme-nodejs-sdk';
import {
  EPaymentBillingType,
  EPaymentInterval,
  EPaymentMethod,
} from '../enums';

export class PlanDto {
  id?: string;
  name: string;
  description: string;
  statementDescriptor: string;
  price: number;
  paymentMethods: Array<EPaymentMethod> = [EPaymentMethod.CREDIT_CARD];
  interval: EPaymentInterval;
  intervalCount: number = 1;
  trialPeriodDays: number = 7;
  billingType: EPaymentBillingType;

  static fromJson(data: any): PlanDto {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      statementDescriptor: data.statement_descriptor,
      price: data.price,
      paymentMethods: data.payment_methods,
      interval: data.interval,
      intervalCount: data.interval_count,
      trialPeriodDays: data.trial_period_days,
      billingType: data.billing_type,
    };
  }

  static fromResponse(response: GetPlanResponse): PlanDto {
    const plan = new PlanDto();
    plan.id = response.id;
    plan.name = response.name;
    plan.description = response.description;
    plan.statementDescriptor = response.statementDescriptor;
    plan.price = response.items?.[0].pricingScheme.price || 0;
    plan.paymentMethods = (response.paymentMethods as any) || [
      EPaymentMethod.CREDIT_CARD,
    ];
    plan.interval =
      (response.interval as EPaymentInterval) || EPaymentInterval.MONTH;
    plan.intervalCount = response.intervalCount || 1;
    plan.trialPeriodDays = response.trialPeriodDays || 7;
    plan.billingType =
      (response.billingType as EPaymentBillingType) ||
      EPaymentBillingType.PREPAID;

    return plan;
  }
}
