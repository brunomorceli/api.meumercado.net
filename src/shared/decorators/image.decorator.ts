import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';
import { Regex } from '../utils';

export const ImageDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsString(),
    Matches(Regex.URL_OR_BLOB, {
      message: 'Must be a valid URL or a blob image.',
    }),
    ApiProperty({
      description: 'Image URL or a hexadecilmal blob image',
      type: String,
      example: 'http:foobar.com, data:image/png;...',
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
