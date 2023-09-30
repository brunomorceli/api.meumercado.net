import {
  CepDecorator,
  CpfCnpjDecorator,
  DateDecorator,
  EmailDecorator,
  EnumDecorator,
  PhoneNumberDecorator,
  StringDecorator,
  UFDecorator,
  UuidDecorator,
} from '@App/shared';
import {
  CompanyStatusType,
  RoleType,
  User,
  UserStatusType,
} from '@prisma/client';
import { IsInstance, IsOptional } from 'class-validator';
import { BillingDataDto, DeliveryDataDto } from '../dtos';

export class CompanyUserEntity {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  name: string;

  @UuidDecorator()
  companyId: string;

  @EnumDecorator({ enumType: RoleType })
  role: RoleType;

  @EmailDecorator()
  email: string;

  @StringDecorator({ required: false })
  description?: string;

  @CpfCnpjDecorator({ required: false })
  cpfCnpj?: string;

  @PhoneNumberDecorator({ onlyNumbers: true, required: false })
  phoneNumber?: string;

  @StringDecorator({ required: false })
  address?: string;

  @StringDecorator({ required: false, empty: true })
  addressComplement?: string;

  @StringDecorator({ required: false })
  neighborhood?: string;

  @StringDecorator({ required: false })
  city?: string;

  @UFDecorator({ required: false })
  state?: string;

  @StringDecorator({ required: false, empty: true })
  addressNumber?: string;

  @CepDecorator({ required: false })
  cep?: string;

  @EnumDecorator({ enumType: CompanyStatusType, required: false })
  status: UserStatusType;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @DateDecorator({ description: 'Deleting date.', required: false })
  deletedAt?: string;

  @IsInstance(BillingDataDto)
  @IsOptional()
  billingData?: BillingDataDto;

  @IsInstance(DeliveryDataDto)
  @IsOptional()
  deliveryData?: DeliveryDataDto;

  constructor(data: User | any) {
    const { billingDatas, deliveryDatas, ...rest } = data;

    Object.keys(rest).forEach((key) => {
      this[key] = rest[key];
    });

    if (billingDatas && billingDatas.length !== 0) {
      this.billingData = billingDatas[0];
    }

    if (deliveryDatas && deliveryDatas.length !== 0) {
      this.deliveryData = deliveryDatas[0];
    }
  }
}
