import { TenantIdDecorator, UuidDecorator } from '@App/shared';

export class SigninResponseDto {
  @TenantIdDecorator()
  tenantId: string;

  @UuidDecorator()
  authId: string;
}
