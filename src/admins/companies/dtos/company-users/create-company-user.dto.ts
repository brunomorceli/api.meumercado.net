import {
  CepDecorator,
  CpfCnpjDecorator,
  EmailDecorator,
  EnumDecorator,
  StringDecorator,
  UFDecorator,
} from '@App/shared';
import { RoleType } from '@prisma/client';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { CreateBillingDataDto } from './create-billing-data.dto';
import { CreateDeliveryDataDto } from './create-delivery-data.dto';
import { Type } from 'class-transformer';

export class CreateCompanyUserDto {
  @StringDecorator()
  name: string;

  @EnumDecorator({
    enumType: RoleType,
    decorators: [IsIn([RoleType.MEMBER, RoleType.SUPPLIER, RoleType.CUSTOMER])],
  })
  role: RoleType;

  @EmailDecorator()
  email: string;

  @CpfCnpjDecorator({ required: false })
  cpfCnpj?: string;

  @StringDecorator({ required: false, empty: true })
  phoneNumber?: string;

  @StringDecorator({ required: false })
  address?: string;

  @StringDecorator({ required: false, empty: true })
  addressComplement?: string;

  @StringDecorator({ required: false })
  neighborhood?: string;

  @StringDecorator({ required: false })
  city?: string;

  @UFDecorator({ required: false })
  state?: string;

  @StringDecorator({ required: false, empty: true })
  addressNumber?: string;

  @CepDecorator({ required: false })
  cep?: string;

  @ValidateNested()
  @Type(() => CreateBillingDataDto)
  @IsOptional()
  billingData?: CreateBillingDataDto;

  @ValidateNested()
  @Type(() => CreateDeliveryDataDto)
  deliveryData?: CreateDeliveryDataDto;
}
