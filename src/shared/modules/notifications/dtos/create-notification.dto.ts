import { NotificationTarget, NotificationType } from '@prisma/client';
import { EnumDecorator, StringDecorator, UuidDecorator } from '@App/shared';

export class CreateNotificationDto {
  @StringDecorator()
  label: string;

  @EnumDecorator({ enumType: NotificationTarget })
  target: NotificationTarget;

  @EnumDecorator({ enumType: NotificationType })
  type: NotificationType;

  @UuidDecorator({ required: false })
  userId?: string;

  @UuidDecorator({ required: false })
  orderId?: string;
}
