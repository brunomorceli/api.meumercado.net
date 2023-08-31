import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const StringNumberDecorator = (
  dataParams?: DefaultPropertyDecoratorOptions,
) => {
  const data = dataParams || {};
  const decorators = [
    IsNumberString(),
    ApiProperty({
      description: 'Simple Numeric',
      type: String,
      example: '1234',
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
