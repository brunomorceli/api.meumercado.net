import {
  DateDecorator,
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
  StringNumberDecorator,
  UuidDecorator,
} from '@App/shared';
import { OrderStatus } from '@prisma/client';

export class FindOrderEntity {
  @StringNumberDecorator()
  id: number;

  @UuidDecorator()
  userId: string;

  @StringDecorator()
  userName: string;

  @StringDecorator({ required: false })
  phoneNumber?: string;

  @StringDecorator()
  cpfCnpj: string;

  @UuidDecorator()
  companyId: string;

  @EnumDecorator({ enumType: OrderStatus })
  status: OrderStatus;

  @StringDecorator({ required: false })
  observation?: string;

  @NumberDecorator()
  total: number;

  @NumberDecorator()
  productCount: number;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  constructor(data: any) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
    this.total = Number(data.total || 0);
    this.productCount = Number(data.productCount || 0);
  }
}
