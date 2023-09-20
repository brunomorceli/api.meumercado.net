import { RoleDto, StringDecorator } from '@App/shared';

export class ConfirmResponseDto {
  @StringDecorator({ description: 'Access token.' })
  token: string;

  user: {
    firstName: string;
    lastName: string;
    roles: RoleDto[];
  };

  @StringDecorator({ description: 'User role.' })
  type: string;

  company: {
    id: string;
    tenantId: string;
  };
}
