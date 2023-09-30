import { EmailDecorator, StringDecorator } from '@App/shared';

export class CreateCompanyDto {
  @StringDecorator()
  companyName: string;

  @StringDecorator()
  userName: string;

  @EmailDecorator()
  email: string;
}
