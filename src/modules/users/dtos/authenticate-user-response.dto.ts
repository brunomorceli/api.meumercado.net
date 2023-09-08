import { TenantIdDecorator } from '@App/shared';

export class AuthenticateUserResponseDto {
  @TenantIdDecorator({ required: false })
  tenantId?: string;
  authId?: string;
}
