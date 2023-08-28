import { EnumDecorator, NumberDecorator, UuidDecorator } from '@App/shared';
import { CompanyProductStatusType } from '@prisma/client';

export class UpsertCompanyProductDto {
  @UuidDecorator()
  id?: string;

  @NumberDecorator()
  quantity: number;

  @NumberDecorator()
  price: number;

  @EnumDecorator({ enumType: CompanyProductStatusType })
  status: CompanyProductStatusType;

  @UuidDecorator()
  companyId: string;

  @UuidDecorator()
  productId: string;

  @UuidDecorator()
  categoryId: string;
}
