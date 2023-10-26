import {
  CepDecorator,
  CpfCnpjDecorator,
  EmailDecorator,
  StringDecorator,
  UFDecorator,
} from '@App/shared';

export class SignupDto {
  @StringDecorator()
  name: string;

  @EmailDecorator()
  email: string;

  @CpfCnpjDecorator()
  cpfCnpj: string;

  @StringDecorator({ required: false, empty: true })
  phoneNumber?: string;

  @StringDecorator()
  address: string;

  @StringDecorator({ required: false, empty: true })
  addressComplement?: string;

  @StringDecorator()
  neighborhood: string;

  @StringDecorator()
  city: string;

  @UFDecorator()
  state: string;

  @StringDecorator({ required: false, empty: true })
  addressNumber?: string;

  @CepDecorator()
  cep: string;
}
