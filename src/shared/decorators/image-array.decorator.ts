import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';
import { Regex } from '../utils';

export const ImageArrayDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsArray(),
    Validate((val) => {
      if (val.some((v) => !Regex.URL_OR_BLOB.test(v))) {
        return false;
      }

      return true;
    }),
    ApiProperty({
      description: 'Image URL or a hexadecilmal blob image arry',
      type: String,
      example: '["http:foobar.com", "data:image/png;..."]',
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
