import { EmailDecorator, StringDecorator } from '@App/shared';

export class SignupDto {
  @EmailDecorator()
  email: string;

  @StringDecorator()
  userName: string;

  @StringDecorator()
  companyName: string;
}
