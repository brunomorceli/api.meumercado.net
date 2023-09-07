import { EmailDecorator, SubdomainDecorator } from '@App/shared';

export class CreateCompanyDto {
  @EmailDecorator()
  email: string;

  @SubdomainDecorator()
  label: string;
}
