import {
  HexacolorDecorator,
  HexadecimalDecorator,
  StringDecorator,
} from '@App/shared';

export class CreateCategoryDto {
  @StringDecorator()
  label: string;

  @HexacolorDecorator()
  color: string;

  @HexadecimalDecorator({ description: 'Image cover', required: false })
  blob?: string;
}
