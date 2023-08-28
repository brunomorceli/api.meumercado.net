import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const StringDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsString(),
    ApiProperty({
      description: 'Simple Text',
      type: String,
      example: 'abc123',
      ...data,
    }),
  ];

  if (data && data && data.empty !== true) {
    decorators.push(IsNotEmpty());
  }

  if (data && data && data.required === false) {
    decorators.push(IsOptional());
  }

  return applyDecorators(...decorators, ...((data || {}).decorators || []));
};
