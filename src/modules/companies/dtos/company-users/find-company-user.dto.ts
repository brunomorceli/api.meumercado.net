import {
  CpfCnpjDecorator,
  EmailDecorator,
  PaginationDto,
  PhoneNumberDecorator,
  StringDecorator,
} from '@App/shared';
import { RoleType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const roleTypeValues: string[] = Object.values(RoleType);
@ValidatorConstraint({ name: 'roleType', async: false })
class CustonRoleType implements ValidatorConstraintInterface {
  validate(value: string) {
    return roleTypeValues.includes(value);
  }

  defaultMessage() {
    return `role param accepts only [${roleTypeValues.join(', ')}] values.`;
  }
}

export class FindCompanyUserDto extends PaginationDto {
  @StringDecorator({ required: false })
  name?: string;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  @IsArray()
  @Validate(CustonRoleType, { each: true })
  roles?: RoleType[];

  @EmailDecorator({ required: false })
  email?: string;

  @CpfCnpjDecorator({ required: false })
  cpfCnpj?: string;

  @PhoneNumberDecorator({ onlyNumbers: true, required: false })
  phoneNumber?: string;
}
