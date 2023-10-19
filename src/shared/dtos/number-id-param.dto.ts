import { StringNumberDecorator } from '@App/shared/decorators';

export class NumberIdParamDto {
  @StringNumberDecorator({ description: 'ID' })
  id: string;
}
