import {
  ArrayDecorator,
  CepDecorator,
  CpfCnpjDecorator,
  EmailDecorator,
  EnumDecorator,
  ImageDecorator,
  PhoneNumberDecorator,
  StringDecorator,
  UFDecorator,
  UpdateEntityDto,
  UuidDecorator,
} from '@App/shared';
import { CompanyStatusType } from '@prisma/client';
import { CategoryDto } from './category.dto';

export class UpdateCompanyDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  name?: UpdateEntityDto;

  @EmailDecorator({ required: false })
  email?: UpdateEntityDto;

  @StringDecorator({ required: false })
  description?: string;

  @ImageDecorator({ description: 'Image', required: false, empty: true })
  logo?: string;

  @ArrayDecorator({ type: CategoryDto, required: false })
  categories?: CategoryDto[];

  @EnumDecorator({ enumType: CompanyStatusType, required: false })
  status?: CompanyStatusType;

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
}
