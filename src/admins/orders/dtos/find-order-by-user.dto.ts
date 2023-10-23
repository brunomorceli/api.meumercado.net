import {
  EStatusGroup,
  EnumDecorator,
  PaginationDto,
  UuidDecorator,
} from '@App/shared';
import { OrderStatus } from '@prisma/client';

export class FindOrderByUserDto extends PaginationDto {
  @UuidDecorator()
  userId: string;

  @EnumDecorator({ enumType: EStatusGroup, required: false })
  statusGroups?: EStatusGroup;

  @EnumDecorator({ enumType: OrderStatus, required: false })
  status?: OrderStatus;
}
