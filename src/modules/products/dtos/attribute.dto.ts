import {
  NumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';

export class AttributeDto {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  label: string;

  @StringDecorator()
  @NumberDecorator()
  value: string | number;
}
