import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { UserEntity } from '../entities';

export class FindUserResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: UserEntity })
  data: UserEntity[];
}
