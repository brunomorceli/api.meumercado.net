import { NumberDecorator, StringDecorator, UuidDecorator } from '@App/shared';

export class OrderProductDto {
  @NumberDecorator()
  id: number;

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
