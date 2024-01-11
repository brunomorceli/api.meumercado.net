import { ImageDecorator, NumberDecorator, StringDecorator } from '@App/shared';
import { ProductBase } from '@prisma/client';

export class ProductBaseEntity {
  @NumberDecorator()
  id: number;

  @StringDecorator()
  label: string;

  @ImageDecorator({ required: false })
  picture?: string;

  @StringDecorator()
  ean: string;

  constructor(data: ProductBase | any) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}
