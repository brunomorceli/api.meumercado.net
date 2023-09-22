import {
  CepDecorator,
  CpfCnpjDecorator,
  DateDecorator,
  EmailDecorator,
  PhoneNumberDecorator,
  SlugDecorator,
  StringDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared/decorators';

export class EntityDto {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  name: string;

  @SlugDecorator()
  slug: string;

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

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @DateDecorator({ description: 'Deleting date.', required: false })
  deletedAt?: string;
}
