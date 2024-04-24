import {
  NumberDecorator,
  StringDecorator,
  StringNumberDecorator,
} from '@App/shared/decorators';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UpsertCardDto {
  @StringDecorator({ required: false })
  id?: string;

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

  @StringNumberDecorator()
  holderDocument: string;

  static toJson(customerId: string, data: UpsertCardDto): any {
    const result: any = {
      customer_id: customerId,
      number: data.number,
      holder_name: data.holderName,
      exp_month: data.expMonth,
      exp_year: data.expYear,
      cvv: data.cvv,
      billing_address: AddressDto.toJson(data.billingAddress),
      holder_document: data.holderDocument,
      metadata: {},
    };

    if (data.id) {
      result.id = data.id;
    }

    return result;
  }
}
