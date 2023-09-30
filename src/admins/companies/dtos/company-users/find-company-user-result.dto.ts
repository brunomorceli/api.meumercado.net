import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { CompanyUserEntity } from '../../entities';

export class FindCompanyUserResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: CompanyUserEntity })
  data: CompanyUserEntity[];
}
