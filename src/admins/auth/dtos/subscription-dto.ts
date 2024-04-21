import {
  BooleanDecorator,
  DateDecorator,
  EnumDecorator,
  UuidDecorator,
} from '@App/shared';
import { Plan, Subscription } from '@prisma/client';

export class SubscriptionDto {
  @UuidDecorator()
  id: string;

  @EnumDecorator({ enumType: Plan })
  plan: Plan;

  @DateDecorator()
  createdAt: string;

  @DateDecorator()
  cancelledAt: string;

  @DateDecorator()
  expiredAt: string;

  @BooleanDecorator()
  isActive: boolean;

  @BooleanDecorator()
  isCancelled: boolean;

  constructor(data: Subscription) {
    this.id = data.id;
    this.plan = data.plan;
    this.createdAt = data.createdAt.toISOString();
    this.cancelledAt = Boolean(data.cancelledAt)
      ? data.cancelledAt.toDateString()
      : null;
    this.expiredAt = Boolean(data.expiredAt)
      ? data.expiredAt.toDateString()
      : null;
    this.isCancelled = Boolean(data.cancelledAt);
    this.isActive = new Date(data.expiredAt).getTime() > new Date().getTime();
  }
}
