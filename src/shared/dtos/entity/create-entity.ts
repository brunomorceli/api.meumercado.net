import {
  CepDecorator,
  CpfCnpjDecorator,
  EmailDecorator,
  PhoneNumberDecorator,
  StringDecorator,
  UFDecorator,
} from '@App/shared/decorators';

export class CreateEntityDto {
  @StringDecorator()
  name: string;

  @EmailDecorator()
  email: string;

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

  @StringDecorator({ required: false })
  responsible?: string;
}
