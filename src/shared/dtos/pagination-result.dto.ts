import { NumberDecorator } from '@App/shared';

export class PaginationResultDto {
  @NumberDecorator({
    description: 'Current page.',
    required: false,
    default: 1,
  })
  page?: number;

  @NumberDecorator({
    description: 'Result limit to be returned.',
    required: false,
    default: 20,
  })
  limit?: number;

  @NumberDecorator({
    description: 'Total of results.',
    required: false,
    default: 20,
  })
  total?: number;
}
