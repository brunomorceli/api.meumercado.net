import { Type } from 'class-transformer';
import { StockProductDto } from './stock-product.dto';
import { ValidateNested } from 'class-validator';
import { ArrayDecorator } from '@App/shared';

export class CheckStockResultDto {
  @Type(() => StockProductDto)
  @ValidateNested()
  products: StockProductDto[];

  @ArrayDecorator({ type: String })
  unlimitedProducts: string[];
}
