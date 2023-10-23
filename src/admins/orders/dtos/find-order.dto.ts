import {
  EStatusGroup,
  EnumDecorator,
  PaginationDto,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { OrderStatus } from '@prisma/client';

export class FindOrderDto extends PaginationDto {
  @UuidDecorator({ required: false })
  userId?: string;

  @StringDecorator({ required: false })
  userName?: string;

  @StringDecorator({ required: false })
  productName?: string;

  @StringDecorator({ required: false })
  cpfCnpj?: string;

  @StringDecorator({ required: false })
  email?: string;

  @EnumDecorator({ enumType: OrderStatus, required: false })
  status?: OrderStatus;

  @EnumDecorator({ enumType: EStatusGroup, required: false })
  statusGroups?: EStatusGroup;

  static getWhereByStatusGroup(
    statusGroup: EStatusGroup,
    tableAlias?: string,
  ): string {
    const prefix = tableAlias ? `${tableAlias}.` : '';
    switch (statusGroup) {
      case EStatusGroup.ACTIVES:
        return ` and ${prefix}.status in([
         ' ${OrderStatus.PENDING}',
         ' ${OrderStatus.PREPARING}',
         ' ${OrderStatus.SHIPPING}'
        ])`;
      case EStatusGroup.INACTIVES:
        return ` and ${prefix}.status in([
          ' ${OrderStatus.DONE}',
          ' ${OrderStatus.CANCELED_BY_CLIENT}',
          ' ${OrderStatus.CANCELED_BY_COMPANY}'
        ])`;
      default:
        return '';
    }
  }
}
