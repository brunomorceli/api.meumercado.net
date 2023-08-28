import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsHexadecimal,
} from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const HexadecimalDecorator = (
  data?: DefaultPropertyDecoratorOptions,
) => {
  const decorators = [
    IsHexadecimal(),
    IsString(),
    ApiProperty({
      description: 'Key encrypted with hexadecimal',
      example: 'a1f2b7c2ccaa2',
      type: String,
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
