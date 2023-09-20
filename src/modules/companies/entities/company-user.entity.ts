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
import { CompanyUser, CompanyUserStatusType } from '@prisma/client';

export class CompanyUserEntity {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  name?: string;

  @SlugDecorator({ required: false })
  slug?: string;

  @StringDecorator({ required: false })
  observation?: string;

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

  @NumberDecorator({ required: false })
  addressNumber?: string;

  @CepDecorator({ required: false })
  cep?: string;

  @PhoneNumberDecorator({ required: false })
  phoneNumber?: string;

  @EmailDecorator({ required: false })
  email?: string;

  @ImageDecorator({ required: false })
  logo?: string;

  @ArrayDecorator({ type: String })
  roles: string[];

  @EnumDecorator({ enumType: CompanyUserStatusType })
  status: CompanyUserStatusType;

  @UuidDecorator()
  companyId: string;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @DateDecorator({ description: 'Deleting date.', required: false })
  deletedAt?: string;

  constructor(data: CompanyUser) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}
