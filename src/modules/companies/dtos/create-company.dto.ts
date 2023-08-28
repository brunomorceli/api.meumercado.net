import {
  CepDecorator,
  HexadecimalDecorator,
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

  @StringDecorator({ required: false })
  addressComplement?: string;

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

  @HexadecimalDecorator({ description: 'Image cover', required: false })
  blob?: string;
}
