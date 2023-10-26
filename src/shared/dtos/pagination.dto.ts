import { EOrderBy, EnumDecorator, StringNumberDecorator } from '@App/shared';

export class PaginationDto {
  @StringNumberDecorator({
    description: 'Current page.',
    required: false,
    default: 1,
  })
  page?: number;

  @StringNumberDecorator({
    description: 'Result limit to be returned.',
    required: false,
    default: 20,
  })
  limit?: number;

  @EnumDecorator({ enumType: EOrderBy, required: false })
  orderBy?: EOrderBy;

  static getPaginationParams(data: PaginationDto): any {
    const page = Math.max(Number(data.page || 1), 1);
    const limit = Number(data.limit || 20);
    const skip = (page - 1) * limit;
    return { page, limit, skip, orderBy: EOrderBy.desc };
  }
}
