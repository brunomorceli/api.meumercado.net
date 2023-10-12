import { StringDecorator } from '@App/shared';

export class CancelOrderDto {
  @StringDecorator()
  observation: string;
}
