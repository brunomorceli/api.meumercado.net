import { EmailDecorator, StringDecorator } from '@App/shared';

export class CreateCompanyDto {
  @StringDecorator()
  companyName: string;

  @StringDecorator()
  userFirstName: string;

  @StringDecorator()
  userLastName: string;

  @EmailDecorator()
  email: string;
}
