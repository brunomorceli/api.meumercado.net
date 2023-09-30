import { EnumDecorator, NumberDecorator, StringDecorator } from '@App/shared';
import { CreditCardType, PaymentMethod } from '@prisma/client';

export class CreateOrderPaymentDto {
  @NumberDecorator()
  amount: number;

  @NumberDecorator()
  discount: number;

  @StringDecorator({ required: false })
  observation?: string;

  @EnumDecorator({ enumType: PaymentMethod })
  method: PaymentMethod;

  @StringDecorator({ required: false })
  creditCardName?: string;

  @EnumDecorator({ enumType: CreditCardType, required: false })
  creditCardType?: CreditCardType;
}
