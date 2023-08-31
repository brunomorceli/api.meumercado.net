import {
  CepDecorator,
  ImageDecorator,
  NumberDecorator,
  StringDecorator,
  SubdomainDecorator,
  UFDecorator,
} from '@App/shared';

export class CreateCompanyDto {
  @StringDecorator()
  label: string;

  @SubdomainDecorator()
  subdomain: string;

  @StringDecorator({ required: false })
  description?: string;

  @StringDecorator()
  address: string;

  @StringDecorator()
  addressComplement: string;

  @StringDecorator()
  neighborhood: string;

  @NumberDecorator({ min: 0 })
  addressNumber: number;

  @StringDecorator()
  city: string;

  @UFDecorator()
  state: string;

  @CepDecorator()
  cep: string;

  @StringDecorator()
  phoneNumber: string;

  @ImageDecorator({ description: 'Image', required: false })
  logo?: string;
}
