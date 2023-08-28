import { CompanyEntity } from '@App/modules/companies';
import { ArrayDecorator, StringDecorator } from '@App/shared';

export class ConfirmAuthenticationResponseDto {
  @StringDecorator({ description: 'Access token.' })
  token: string;

  @StringDecorator({ description: 'User name.' })
  userName: string;

  @StringDecorator({ description: 'User role.' })
  type: string;

  @ArrayDecorator({ type: CompanyEntity })
  companies: CompanyEntity[];
}
