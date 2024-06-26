import {
  ArrayDecorator,
  CepDecorator,
  CpfCnpjDecorator,
  EmailDecorator,
  EnumDecorator,
  ImageArrayDecorator,
  ImageDecorator,
  PhoneNumberDecorator,
  StringDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared';
import { CompanyStatusType } from '@prisma/client';
import { CategoryDto } from './category.dto';
import { IsObject, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  name?: string;

  @EmailDecorator({ required: false })
  email?: string;

  @StringDecorator({ required: false })
  description?: string;

  @ImageDecorator({ description: 'Image', required: false, empty: true })
  logo?: string;

  @ImageArrayDecorator({ required: false })
  covers?: string[];

  @ArrayDecorator({ type: CategoryDto, required: false })
  categories?: CategoryDto[];

  @IsObject()
  @IsOptional()
  theme?: any;

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

  @StringDecorator({ required: false, empty: true })
  responsible?: string;
}
