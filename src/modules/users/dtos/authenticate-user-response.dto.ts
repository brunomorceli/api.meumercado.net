import { SubdomainDecorator } from '@App/shared';

export class AuthenticateUserResponseDto {
  @SubdomainDecorator({ required: false })
  subdomain?: string;
}
