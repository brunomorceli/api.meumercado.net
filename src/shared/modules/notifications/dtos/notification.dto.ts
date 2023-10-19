import { NotificationTarget, NotificationType } from '@prisma/client';
import {
  DateDecorator,
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared/decorators';

export class NotificationDto {
  @NumberDecorator()
  id: number;

  @StringDecorator()
  label: string;

  @EnumDecorator({ enumType: NotificationTarget })
  target: NotificationTarget;

  @EnumDecorator({ enumType: NotificationType })
  type: NotificationType;

  @UuidDecorator({ required: false })
  userId?: string;

  @NumberDecorator({ required: false })
  orderId?: number;

  @UuidDecorator()
  companyId: string;

  @DateDecorator()
  createdAt: string;

  constructor(data: Notification) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
}
