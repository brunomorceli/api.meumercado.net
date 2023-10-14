import {
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
}
