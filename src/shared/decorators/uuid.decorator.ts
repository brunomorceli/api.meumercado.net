import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const UuidDecorator = (dataParam?: DefaultPropertyDecoratorOptions) => {
  const data = dataParam || {};
  const decorators = [
    IsUUID(),
    ApiProperty({
      description: 'Uuid',
      type: String,
      example: '48010217-47e9-47b7-a2e5-c2b3e9b1d509',
      ...data,
    }),
  ];

  if (data.empty !== true) {
    decorators.push(IsNotEmpty());
  }

  if (data.required === false) {
    decorators.push(IsOptional());
  }

  return applyDecorators(...decorators, ...((data || {}).decorators || []));
};
