import {
  ArrayDecorator,
  CepDecorator,
  EmailDecorator,
  EnumDecorator,
  ImageDecorator,
  NumberDecorator,
  StringDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared';
import { CompanyStatusType } from '@prisma/client';
import { CategoryDto } from './category.dto';

export class UpdateCompanyDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  label?: string;

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

  @StringDecorator({ required: false })
  phoneNumber?: string;

  @EmailDecorator({ required: false })
  email?: string;

  @StringDecorator({ required: false })
  manager?: string;

  @ImageDecorator({ description: 'Image', required: false, empty: true })
  logo?: string;

  @ArrayDecorator({ type: CategoryDto, required: false })
  categories?: CategoryDto[];

  @EnumDecorator({ enumType: CompanyStatusType, required: false })
  status?: CompanyStatusType;
}
