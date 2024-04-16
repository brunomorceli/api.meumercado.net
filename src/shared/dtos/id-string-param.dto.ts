import { StringDecorator } from '@App/shared/decorators';

export class IdStringParamDto {
  @StringDecorator({ description: 'ID' })
  id: string;
}
