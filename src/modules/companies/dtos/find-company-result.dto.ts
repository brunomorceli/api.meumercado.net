import { ArrayDecorator, PaginationResultDto } from '@App/shared';
import { CompanyEntity } from '../entities/company.entity';

export class FindCompanyResultDto extends PaginationResultDto {
  @ArrayDecorator({ type: CompanyEntity })
  data: CompanyEntity[];
}
