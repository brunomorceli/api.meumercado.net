import { NotificationTarget, NotificationType } from '@prisma/client';
import {
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';

export class CreateNotificationDto {
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
}
