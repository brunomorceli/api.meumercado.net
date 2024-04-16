import {
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
  StringNumberDecorator,
} from '@App/shared/decorators';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { EPagarmeCardType } from '../enums';

export class CardDto {
  @StringDecorator()
  id: string;

  @StringNumberDecorator()
  number: string;

  @StringDecorator()
  holderName: string;

  @NumberDecorator()
  expMonth: number;

  @NumberDecorator()
  expYear: number;

  @StringDecorator()
  cvv: string;

  @Type(() => AddressDto)
  @IsNotEmpty()
  billingAddress: AddressDto;

  @StringDecorator()
  brand: string;

  @EnumDecorator({ enumType: EPagarmeCardType })
  type: EPagarmeCardType;

  @StringNumberDecorator()
  holderDocument: string;

  static fromJson(data: any): CardDto {
    return {
      id: data.id,
      number: data.number,
      type: data.type,
      brand: data.brand,
      cvv: data.cvv,
      expMonth: data.exp_month,
      expYear: data.exp_year,
      holderDocument: data.holder_document,
      holderName: data.holder_name,
      billingAddress: AddressDto.fromJson(data.billing_address),
    };
  }
}
