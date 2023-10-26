import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { OrderEntity } from '../entities';

export class FindOrderResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: OrderEntity })
  data: OrderEntity[];
}
