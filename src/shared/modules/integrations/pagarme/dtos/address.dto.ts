import {
  StringDecorator,
  StringNumberDecorator,
  UFDecorator,
} from '@App/shared/decorators';

export class AddressDto {
  @StringDecorator()
  street: string;

  @StringDecorator()
  neighborhood: string;

  @StringNumberDecorator()
  number: string;

  @StringDecorator()
  country: string;

  @UFDecorator()
  state: string;

  @StringDecorator()
  city: string;

  @StringNumberDecorator()
  zipCode: string;

  static fromJson(data: any): AddressDto {
    return {
      street: data.street,
      neighborhood: data.neighborhood,
      number: data.number,
      country: data.country,
      state: data.state,
      city: data.city,
      zipCode: data.zip_code,
    };
  }

  static toJson(data: AddressDto): any {
    return {
      street: data.street,
      neighborhood: data.neighborhood,
      number: data.number,
      country: data.country,
      state: data.state,
      city: data.city,
      zip_code: data.zipCode,
      complement: '',
      line1: '',
      line2: '',
    };
  }
}
