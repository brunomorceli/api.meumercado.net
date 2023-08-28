import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const IntegerDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsInt({
      message: data.message || 'Must be an integer',
    }),
    ApiProperty({
      description: data.description || 'Simple Integer Number',
      type: Number,
      example: 1590,
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
