import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Regex } from '../utils';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

interface PhoneNumberDecoratorProps extends DefaultPropertyDecoratorOptions {
  onlyNumbers?: boolean;
}
export const PhoneNumberDecorator = (data: PhoneNumberDecoratorProps = {}) => {
  const decorators = [
    IsString(),
    Matches(
      data.onlyNumbers ? Regex.PHONE_NUMBER_ONLY_NUMBERS : Regex.PHONE_NUMBER,
    ),
    ApiProperty({
      description: 'Phone Number',
      type: String,
      pattern: RegExp(
        data.onlyNumbers ? Regex.PHONE_NUMBER_ONLY_NUMBERS : Regex.PHONE_NUMBER,
      ).toString(),
      example: data.onlyNumbers
        ? '9999999999 or 99999999999'
        : '(99) 9999-9999 or (99) 99999-9999',
      ...data,
    }),
  ];

  if (data && data.empty !== true) {
    decorators.push(IsNotEmpty());
  }

  if (data && data.required === false) {
    decorators.push(IsOptional());
  }

  return applyDecorators(...decorators, ...((data || {}).decorators || []));
};
