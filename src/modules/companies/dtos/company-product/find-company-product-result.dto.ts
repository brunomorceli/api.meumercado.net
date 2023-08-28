import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { CompanyProductEntity } from '../../entities';

export class FindCompanyProductResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: CompanyProductEntity })
  data: CompanyProductEntity[];
}
