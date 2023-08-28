import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsNotEmpty, IsOptional } from 'class-validator';
import { Regex } from '../utils';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const IsoDateDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsString(),
    Matches(Regex.ISO_DATE),
    ApiProperty({
      description: 'Iso Date',
      type: String,
      pattern: RegExp(Regex.ISO_DATE).toString(),
      example: '1996-10-15T00:05:32.000Z',
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
