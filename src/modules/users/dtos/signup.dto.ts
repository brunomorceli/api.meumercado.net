import { EmailDecorator, StringDecorator } from '@App/shared';

export class SignupDto {
  @EmailDecorator()
  email: string;

  @StringDecorator()
  firstName: string;

  @StringDecorator()
  lastName: string;

  @StringDecorator()
  label: string;
}
