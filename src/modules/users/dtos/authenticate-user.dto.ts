import { EmailDecorator, StringDecorator } from '@App/shared';

export class AuthenticateUserDto {
  @EmailDecorator()
  email: string;

  @StringDecorator({ required: false })
  label: string;
}
