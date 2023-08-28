import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';
import { Type } from 'class-transformer';

export const ArrayTypeDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => data.type as any),
    ApiProperty({
      description: 'Array type validate string.',
      type: data.type || Array,
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
