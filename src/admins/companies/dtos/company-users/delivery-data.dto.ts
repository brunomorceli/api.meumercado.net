import { UuidDecorator } from '@App/shared';
import { CreateDeliveryDataDto } from './create-delivery-data.dto';

export class DeliveryDataDto extends CreateDeliveryDataDto {
  @UuidDecorator()
  id: string;
}
