import {
  CepDecorator,
  DateDecorator,
  EnumDecorator,
  NumberDecorator,
  StringDecorator,
  SubdomainDecorator,
  UFDecorator,
  UrlDecorator,
  UuidDecorator,
} from '@App/shared';
import { Company, CompanyStatusType } from '@prisma/client';

export class CompanyEntity {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  label: string;

  @SubdomainDecorator()
  subdomain: string;

  @StringDecorator()
  address: string;

  @StringDecorator({ required: false })
  description?: string;

  @StringDecorator({ required: false })
  addressComplement?: string;

  @StringDecorator()
  neighborhood: string;

  @StringDecorator()
  city: string;

  @UFDecorator()
  state: string;

  @NumberDecorator({ min: 0 })
  addressNumber: string;

  @CepDecorator()
  cep: string;

  @UrlDecorator({ description: 'Logo Image URL.', required: false })
  logo?: string;

  @EnumDecorator({ enumType: CompanyStatusType })
  status: CompanyStatusType;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @DateDecorator({ description: 'Deleting date.', required: false })
  deletedAt?: string;

  constructor(data: Company) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}
