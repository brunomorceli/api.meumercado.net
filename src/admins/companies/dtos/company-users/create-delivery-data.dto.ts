import {
  CepDecorator,
  CpfCnpjDecorator,
  EmailDecorator,
  PhoneNumberDecorator,
  StringDecorator,
  UFDecorator,
} from '@App/shared';

export class CreateDeliveryDataDto {
  @EmailDecorator({ required: false })
  email?: string;

  @PhoneNumberDecorator({ onlyNumbers: true, required: false })
  phoneNumber?: string;

  @CpfCnpjDecorator()
  cpfCnpj: string;

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

  @StringDecorator()
  responsible: string;
}
