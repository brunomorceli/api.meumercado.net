import { CompanyEntity } from '@App/modules/companies';
import { ObjectDecorator, StringDecorator } from '@App/shared';

export class ConfirmAuthenticationResponseDto {
  @StringDecorator({ description: 'Access token.' })
  token: string;

  @StringDecorator({ description: 'User name.' })
  userName: string;

  @StringDecorator({ description: 'User role.' })
  type: string;

  @ObjectDecorator({ type: CompanyEntity })
  company: CompanyEntity;
}
