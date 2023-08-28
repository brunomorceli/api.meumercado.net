import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const BooleanDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsBoolean(),
    ApiProperty({
      description: 'Simple boolean',
      type: Boolean,
      example: true,
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
