import {
  CpfCnpjDecorator,
  EmailDecorator,
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
  StringNumberDecorator,
} from '@App/shared';
import { AddressDto } from '@App/shared/modules/integrations/pagarme/dtos/address.dto';
import { Plan } from '@prisma/client';
import { Type } from 'class-transformer';
import { Validate } from 'class-validator';

export class UpdateSubscriptionDto {
  @StringDecorator({ required: false })
  userId?: string;

  @EnumDecorator({ enumType: Plan })
  plan: Plan;

  @EmailDecorator()
  email: string;

  @StringDecorator({ minLength: 5, maxLength: 128 })
  name: string;

  @CpfCnpjDecorator()
  document: string;

  @StringNumberDecorator({ minLength: 13, maxLength: 16 })
  cardNumber: string;

  @StringDecorator({ minLength: 5, maxLength: 128 })
  holderName: string;

  @NumberDecorator({ min: 1, max: 12 })
  expMonth: number;

  @NumberDecorator({ min: 1, max: 31 })
  expYear: number;

  @StringDecorator({ minLength: 3, maxLength: 3 })
  cvv: string;

  @CpfCnpjDecorator()
  documentHolder: string;

  @Type(() => AddressDto)
  @Validate(AddressDto)
  personalAddress: AddressDto;

  @Type(() => AddressDto)
  @Validate(AddressDto)
  billingAddress: AddressDto;
}
