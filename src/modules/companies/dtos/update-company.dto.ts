import {
  CepDecorator,
  EnumDecorator,
  ImageDecorator,
  NumberDecorator,
  PhoneNumberDecorator,
  StringDecorator,
  StringNumberDecorator,
  SubdomainDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared';
import { CompanyStatusType } from '@prisma/client';

export class UpdateCompanyDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  label?: string;

  @SubdomainDecorator({ required: false })
  subdomain?: string;

  @StringDecorator({ required: false })
  description?: string;

  @StringDecorator({ required: false })
  address?: string;

  @StringDecorator()
  addressComplement: string;

  @StringDecorator({ required: false })
  neighborhood?: string;

  @StringDecorator({ required: false })
  city?: string;

  @UFDecorator({ required: false })
  state?: string;

  @NumberDecorator({ min: 0, required: false })
  addressNumber?: string;

  @CepDecorator({ required: false })
  cep?: string;

  @StringDecorator()
  phoneNumber: string;

  @ImageDecorator({ description: 'Image', required: false })
  logo?: string;

  @EnumDecorator({ enumType: CompanyStatusType, required: false })
  status?: CompanyStatusType;
}
