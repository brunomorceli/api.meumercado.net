import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const UrlDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsUrl(),
    ApiProperty({
      description: 'Simple Url',
      type: String,
      example: 'http:foobar.com',
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
