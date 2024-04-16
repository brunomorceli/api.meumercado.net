import {
  CpfCnpjDecorator,
  EmailDecorator,
  EnumDecorator,
  StringDecorator,
} from '@App/shared/decorators';
import { EGender } from '../enums/gender.enum';

export class CustomerDto {
  @StringDecorator()
  id: string;

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

  static fromJson(data: any): CustomerDto {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      document: data.email,
      gender: data.gender,
      code: data.code,
    };
  }
}
