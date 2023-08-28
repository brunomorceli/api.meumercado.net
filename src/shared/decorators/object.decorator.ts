import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';
import { Type } from 'class-transformer';

export const ObjectDecorator = (data: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    Type(() => data.type as any),
    ValidateNested({ each: true }),
    IsObject(),
    ApiProperty({
      description: 'Object.',
      type: data.type,
      example: { test: 'Meu Teste' },
      ...data,
    }),
  ];

  if (data && data.empty !== true) {
    decorators.push(IsNotEmpty());
  }

  if (data && data.required === false) {
    decorators.push(IsOptional());
  }

  return applyDecorators(...decorators, ...(data.decorators || []));
};
