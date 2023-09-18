import {
  ArrayDecorator,
  CepDecorator,
  DateDecorator,
  EmailDecorator,
  EnumDecorator,
  ImageDecorator,
  NumberDecorator,
  PhoneNumberDecorator,
  SlugDecorator,
  StringDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared';
import { Company, CompanyStatusType } from '@prisma/client';
import { CategoryDto } from '../dtos';

export class CompanyEntity {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  label: string;

  @SlugDecorator()
  slug: string;

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

  @PhoneNumberDecorator({ onlyNumbers: true, empty: true })
  phoneNumber: string;

  @EmailDecorator({ required: false })
  email?: string;

  @StringDecorator({ required: false })
  manager?: string;

  @ImageDecorator({ required: false })
  logo?: string;

  @ArrayDecorator({ type: CategoryDto })
  categories: CategoryDto[];

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
