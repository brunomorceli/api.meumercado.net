import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBase64 } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const Base64Decorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsBase64(),
    IsString(),
    ApiProperty({
      description: 'Key encrypted with base64',
      example: '=AsuhASuASUh......',
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
