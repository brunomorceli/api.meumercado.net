import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Regex } from '../utils';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const PhoneNumberDecorator = (
  data?: DefaultPropertyDecoratorOptions,
) => {
  const decorators = [
    IsString(),
    Matches(Regex.PHONE_NUMBER),
    ApiProperty({
      description: 'Phone Number',
      type: String,
      pattern: RegExp(Regex.PHONE_NUMBER).toString(),
      example: '(99) 99999-9999',
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
