import {
  CepDecorator,
  CpfCnpjDecorator,
  EmailDecorator,
  StringDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared';

export class UpdateUserDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  name?: string;

  @EmailDecorator({ required: false })
  email?: string;

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
}
