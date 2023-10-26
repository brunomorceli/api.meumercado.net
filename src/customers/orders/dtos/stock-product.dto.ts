import { NumberDecorator, UuidDecorator } from '@App/shared';

export class StockProductDto {
  @UuidDecorator()
  productId: string;

  @NumberDecorator()
  quantity: number;
}
