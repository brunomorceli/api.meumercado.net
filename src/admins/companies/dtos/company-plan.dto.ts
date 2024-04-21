import {
  BooleanDecorator,
  DateDecorator,
  EnumDecorator,
  UuidDecorator,
} from '@App/shared';
import { CompanyPlan, CompanyPlanType } from '@prisma/client';

export class CompanyPlanDto {
  @UuidDecorator()
  id: string;

  @EnumDecorator({ enumType: CompanyPlanType })
  type: CompanyPlanType;

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

  constructor(data: CompanyPlan) {
    this.id = data.id;
    this.type = data.type;
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
