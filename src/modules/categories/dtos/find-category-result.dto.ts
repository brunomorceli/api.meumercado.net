import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { CategoryEntity } from '../entities/category.entity';

export class FindCategoryResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: CategoryEntity })
  data: CategoryEntity[];
}
