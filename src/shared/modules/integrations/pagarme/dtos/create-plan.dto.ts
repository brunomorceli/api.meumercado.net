import {
  EPaymentBillingType,
  EPaymentInterval,
  EPaymentMethod,
} from '../enums';

export class CreatePlanDto {
  name: string;
  description: string;
  statementDescriptor: string;
  price: number;
  paymentMethods: Array<EPaymentMethod> = [EPaymentMethod.CREDIT_CARD];
  interval: EPaymentInterval = EPaymentInterval.MONTH;
  intervalCount: number = 1;
  trialPeriodDays: number = 7;
  billingType: EPaymentBillingType = EPaymentBillingType.PREPAID;
}
