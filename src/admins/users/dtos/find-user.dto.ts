import { PaginationDto, StringDecorator } from '@App/shared';
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

export class FindUserDto extends PaginationDto {
  @StringDecorator({ required: false })
  name?: string;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  @IsArray()
  @Validate(CustonRoleType, { each: true })
  roles?: RoleType[];

  @StringDecorator({ required: false })
  email?: string;

  @StringDecorator({ required: false })
  cpfCnpj?: string;

  @StringDecorator({ required: false })
  phoneNumber?: string;
}
