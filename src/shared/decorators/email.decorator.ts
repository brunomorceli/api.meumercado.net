import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Regex } from '../utils';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const EmailDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsEmail(),
    ApiProperty({
      description: 'Email',
      type: String,
      example: 'email@email.com',
      pattern: Regex.EMAIL.toString(),
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
