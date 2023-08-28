import {
  DateDecorator,
  HexacolorDecorator,
  StringDecorator,
  UrlDecorator,
  UuidDecorator,
} from '@App/shared';
import { Category } from '@prisma/client';

export class CategoryEntity {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  label: string;

  @HexacolorDecorator()
  color: string;

  @StringDecorator()
  slug: string;

  @UrlDecorator({ description: 'Image URL.', required: false })
  cover?: string;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  constructor(data: Category) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}
