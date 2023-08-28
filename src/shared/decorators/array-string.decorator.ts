import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
} from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const ArrayStringDecorator = (
  dataParam?: DefaultPropertyDecoratorOptions,
) => {
  const data = dataParam || {};
  const decorators = [
    IsArray(),
    IsString({ each: true }),
    ApiProperty({
      description: 'Array string validate string.',
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
