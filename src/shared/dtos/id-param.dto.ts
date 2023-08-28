import { UuidDecorator } from '@App/shared/decorators';

export class IdParamDto {
  @UuidDecorator({ description: 'ID' })
  id: string;
}
