import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { OrderEntity } from '../entities';

export class FindOrderByUserResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: OrderEntity })
  data: OrderEntity[];
}
