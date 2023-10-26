import { StringNumberDecorator } from '@App/shared/decorators';

export class FindNotificationDto {
  @StringNumberDecorator({ empty: true })
  last: number;
}
