import {
  ArrayDecorator,
  EProductMeasureType,
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';

export class ProductMeasureDto {
  @StringDecorator()
  label: string;

  @EnumDecorator({ enumType: EProductMeasureType })
  type: EProductMeasureType;

  @StringDecorator()
  unitText: string;

  @ArrayDecorator({ type: String })
  options: string[];

  @StringDecorator()
  @NumberDecorator()
  value: string | number;

  @UuidDecorator()
  id: string;
}
