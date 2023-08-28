import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Regex } from '../utils';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const AlphanumericDecorator = (
  dataParam?: DefaultPropertyDecoratorOptions,
) => {
  const data = dataParam || {};
  const decorators = [
    IsString(),
    Matches(Regex.CONFIRM_TOKEN),
    ApiProperty({
      description: 'Alphanumeric string.',
      type: String,
      example: 'a1B2c3F4',
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
