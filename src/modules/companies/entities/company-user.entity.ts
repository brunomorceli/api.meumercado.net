import {
  CepDecorator,
  CpfCnpjDecorator,
  DateDecorator,
  EmailDecorator,
  EnumDecorator,
  PhoneNumberDecorator,
  StringDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared';
import {
  CompanyStatusType,
  RoleType,
  User,
  UserStatusType,
} from '@prisma/client';

export class CompanyUserEntity {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  firstName: string;

  @StringDecorator()
  lastName: string;

  @UuidDecorator()
  companyId: string;

  @EnumDecorator({ enumType: RoleType })
  role: RoleType;

  @EmailDecorator()
  email: string;

  @StringDecorator({ required: false })
  description?: string;

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

  @EnumDecorator({ enumType: CompanyStatusType, required: false })
  status: UserStatusType;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @DateDecorator({ description: 'Deleting date.', required: false })
  deletedAt?: string;

  constructor(data: User) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}
