import {
  CepDecorator,
  CpfCnpjDecorator,
  EmailDecorator,
  PhoneNumberDecorator,
  StringDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared';
import { IsOptional, ValidateNested } from 'class-validator';
import { BillingDataDto } from './billing-data.dto';
import { DeliveryDataDto } from './delivery-data.dto';
import { Type } from 'class-transformer';

export class UpdateCompanyUserDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  name?: string;

  @EmailDecorator({ required: false })
  email?: string;

  @CpfCnpjDecorator({ required: false })
  cpfCnpj?: string;

  @PhoneNumberDecorator({ onlyNumbers: true, required: false })
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
  @Type(() => BillingDataDto)
  @IsOptional()
  billingData?: BillingDataDto;

  @ValidateNested()
  @Type(() => DeliveryDataDto)
  @IsOptional()
  deliveryData?: DeliveryDataDto;
}
