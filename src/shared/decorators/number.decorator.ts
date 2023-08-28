import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

interface NumberDecoratorProps extends DefaultPropertyDecoratorOptions {
  min?: number;
  max?: number;
}

export const NumberDecorator = (dataParam?: NumberDecoratorProps) => {
  const data = dataParam || {};
  const decorators = [
    IsNumber(),
    ApiProperty({
      description: 'Simple Number',
      type: Number,
      example: 1234,
      ...data,
    }),
  ];

  if (data.min) {
    decorators.push(Min(data.min));
  }

  if (data.max) {
    decorators.push(Max(data.max));
  }

  if (data && data.empty !== true) {
    decorators.push(IsNotEmpty());
  }

  if (data && data.required === false) {
    decorators.push(IsOptional());
  }

  return applyDecorators(...decorators, ...((data || {}).decorators || []));
};
