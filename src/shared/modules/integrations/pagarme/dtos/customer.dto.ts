import {
  CpfCnpjDecorator,
  EmailDecorator,
  StringDecorator,
} from '@App/shared/decorators';

export class CustomerDto {
  @StringDecorator()
  id: string;

  @StringDecorator()
  name: string;

  @EmailDecorator()
  email: string;

  @CpfCnpjDecorator()
  document: string;

  @StringDecorator()
  code: string;

  static fromJson(data: any): CustomerDto {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      document: data.email,
      code: data.code,
    };
  }
}
