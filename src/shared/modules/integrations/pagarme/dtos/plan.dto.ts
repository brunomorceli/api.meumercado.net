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

  public static fromResponse(response: GetPlanResponse): PlanDto {
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
