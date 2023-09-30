import { EnumDecorator, PaginationDto, UuidDecorator } from '@App/shared';
import { OrderStatus } from '@prisma/client';

export class FindOrderDto extends PaginationDto {
  @UuidDecorator({ required: false })
  userId?: string;

  @EnumDecorator({ enumType: OrderStatus, required: false })
  status?: OrderStatus;
}
