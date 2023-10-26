import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { FindOrderEntity, OrderEntity } from '../entities';

export class FindOrderResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: OrderEntity })
  data: FindOrderEntity[];
}
