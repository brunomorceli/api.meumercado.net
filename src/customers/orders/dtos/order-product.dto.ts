import { NumberDecorator, StringDecorator, UuidDecorator } from '@App/shared';

export class OrderProductDto {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  name: string;

  @NumberDecorator()
  quantity: number;

  @NumberDecorator()
  price: number;

  @NumberDecorator()
  total: number;

  @UuidDecorator()
  productId: string;
}
