import { ArrayDecorator, StringDecorator, UuidDecorator } from '@App/shared';

export class CategoryDto {
  @StringDecorator()
  label: string;

  @UuidDecorator()
  value: string;

  @ArrayDecorator({ type: CategoryDto })
  children: CategoryDto;
}
