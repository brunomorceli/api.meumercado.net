import { EmailDecorator, TenantIdDecorator } from '@App/shared';

export class CreateCompanyDto {
  @EmailDecorator()
  email: string;

  @TenantIdDecorator()
  label: string;
}
