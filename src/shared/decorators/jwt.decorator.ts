import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const JwtDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsUrl(),
    ApiProperty({
      description: 'JWT response token.',
      type: String,
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIi...',
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
