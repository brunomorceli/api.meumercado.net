import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsNotEmpty, IsOptional } from 'class-validator';
import { Regex } from '../utils';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const DateTimeDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsString(),
    Matches(Regex.DATE_TIME),
    ApiProperty({
      description: 'Date Time',
      type: String,
      pattern: RegExp(Regex.DATABASE_DATETIME).toString(),
      example: '2023-02-01 10:33',
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
