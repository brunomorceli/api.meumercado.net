import {
  CpfCnpjDecorator,
  EmailDecorator,
  EnumDecorator,
  PaginationDto,
  PhoneNumberDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { RoleType } from '@prisma/client';

export class FindCompanyUserDto extends PaginationDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  name?: string;

  @EnumDecorator({ enumType: RoleType, required: false })
  role?: RoleType;

  @EmailDecorator({ required: false })
  email?: string;

  @CpfCnpjDecorator({ required: false })
  cpfCnpj?: string;

  @PhoneNumberDecorator({ onlyNumbers: true, required: false })
  phoneNumber?: string;
}
