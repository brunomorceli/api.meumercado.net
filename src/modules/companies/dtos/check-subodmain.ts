import { TenantIdDecorator, UuidDecorator } from '@App/shared';

export class CheckTenantIdDto {
  @UuidDecorator({ required: false })
  companyId?: string;

  @TenantIdDecorator()
  tenantId: string;
}
