import { EmailDecorator } from '@App/shared';

export class SigninDto {
  @EmailDecorator()
  email: string;
}
