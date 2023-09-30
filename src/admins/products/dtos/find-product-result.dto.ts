import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { ProductEntity } from '../entities/product.entity';

export class FindProductResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: ProductEntity })
  data: ProductEntity[];
}
