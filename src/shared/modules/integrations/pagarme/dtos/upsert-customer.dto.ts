import {
  CpfCnpjDecorator,
  EmailDecorator,
  EnumDecorator,
  StringDecorator,
} from '@App/shared/decorators';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';
import { EGender } from '../enums/gender.enum';
import { IsNotEmpty } from 'class-validator';

export class UpsertCustomerDto {
  @StringDecorator()
  name: string;

  @EmailDecorator()
  email: string;

  @CpfCnpjDecorator()
  document: string;

  @EnumDecorator({ enumType: EGender })
  gender: EGender;

  @StringDecorator()
  code: string;

  @IsNotEmpty()
  @Type(() => AddressDto)
  address: AddressDto;

  static toJson(data: UpsertCustomerDto, id?: string): any {
    const result: any = {
      name: data.name,
      email: data.email,
      document: data.document,
      type: 'individual',
      gender: data.gender,
      code: data.code,
      address: AddressDto.toJson(data.address),
      phones: {},
      metadata: {},
    };

    if (id) {
      result.id = id;
    }

    return result;
  }
}
