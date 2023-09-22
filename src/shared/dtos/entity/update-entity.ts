import {
  CepDecorator,
  CpfCnpjDecorator,
  EmailDecorator,
  PhoneNumberDecorator,
  StringDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared/decorators';

export class UpdateEntityDto {
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

  @StringDecorator({ required: false })
  addressComplement?: string;

  @StringDecorator({ required: false })
  neighborhood?: string;

  @StringDecorator({ required: false })
  city?: string;

  @UFDecorator({ required: false })
  state?: string;

  @StringDecorator({ required: false })
  addressNumber?: string;

  @CepDecorator({ required: false })
  cep?: string;

  @StringDecorator({ required: false })
  responsible?: string;
}
