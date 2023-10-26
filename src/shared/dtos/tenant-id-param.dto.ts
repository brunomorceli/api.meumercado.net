import { UuidDecorator } from '@App/shared/decorators';

export class ITenantIdParam {
  @UuidDecorator({ description: 'tenantId' })
  tenantId: string;
}
