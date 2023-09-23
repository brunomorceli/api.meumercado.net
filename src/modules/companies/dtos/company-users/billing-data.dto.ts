import { UuidDecorator } from '@App/shared';
import { CreateBillingDataDto } from './create-billing-data.dto';

export class BillingDataDto extends CreateBillingDataDto {
  @UuidDecorator()
  id: string;
}
