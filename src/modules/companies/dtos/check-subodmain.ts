import { SubdomainDecorator, UuidDecorator } from '@App/shared';

export class CheckSubdomainDto {
  @UuidDecorator({ required: false })
  companyId?: string;

  @SubdomainDecorator()
  subdomain: string;
}
