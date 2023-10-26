import { Type } from 'class-transformer';
import { StockProductDto } from './stock-product.dto';
import { ValidateNested } from 'class-validator';

export class CheckStockDto {
  @Type(() => StockProductDto)
  @ValidateNested()
  products: StockProductDto[];
}
