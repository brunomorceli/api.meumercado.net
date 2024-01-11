import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { ProductBaseEntity } from '../entities/product-base.entity';

export class FindProductBaseResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: ProductBaseEntity })
  data: ProductBaseEntity[];
}
