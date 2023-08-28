import {
  CepDecorator,
  EnumDecorator,
  HexadecimalDecorator,
  NumberDecorator,
  StringDecorator,
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

  @StringDecorator({ required: false })
  addressComplement?: string;

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

  @HexadecimalDecorator({ description: 'Image cover', required: false })
  blob?: string;

  @EnumDecorator({ enumType: CompanyStatusType, required: false })
  status?: CompanyStatusType;
}
