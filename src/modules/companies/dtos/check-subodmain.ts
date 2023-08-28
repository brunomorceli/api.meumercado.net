import { SubdomainDecorator, UuidDecorator } from '@App/shared';

export class CheckSubdomainDto {
  @UuidDecorator({ required: false })
  id?: string;

  @SubdomainDecorator()
  subdomain: string;
}
