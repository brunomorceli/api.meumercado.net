import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Regex } from '../utils';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const SlugDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsString(),
    Matches(Regex.SLUG),
    ApiProperty({
      description: 'Search slug text',
      type: String,
      pattern: RegExp(Regex.SLUG).toString(),
      example: 'foo, foobar, foobar123, foo-bar-123',
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
