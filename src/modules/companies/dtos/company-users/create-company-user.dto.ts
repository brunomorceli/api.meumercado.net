import { EmailDecorator, EnumDecorator } from '@App/shared';
import { CompanyUserType } from '@prisma/client';

export class CreateCompanyUserDto {
  @EmailDecorator()
  email: string;

  @EnumDecorator({ enumType: CompanyUserType })
  type: CompanyUserType;
}
