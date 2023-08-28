import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

interface ArrayDecoratorProps extends DefaultPropertyDecoratorOptions {
  type: any;
  arrayMinSize?: number;
  arrayMaxSize?: number;
}

export const ArrayDecorator = (data?: ArrayDecoratorProps) => {
  const decorators = [
    IsArray(),
    Type(() => data.type),
    ApiProperty({
      description: 'Array string validate string.',
      type: data.type,
      ...data,
    }),
  ];

  if (data && data.empty !== true) {
    decorators.push(IsNotEmpty());
  }

  if (data && data.required === false) {
    decorators.push(IsOptional());
  }

  if (data.arrayMinSize) {
    decorators.push(ArrayMinSize(data.arrayMinSize));
  }

  if (data.arrayMaxSize) {
    decorators.push(ArrayMaxSize(data.arrayMaxSize));
  }

  return applyDecorators(...decorators, ...((data || {}).decorators || []));
};
