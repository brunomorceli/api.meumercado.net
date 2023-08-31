import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Regex } from '../utils';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const SubdomainDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsString(),
    Matches(Regex.SUBDOMAIN, {
      message: 'O subdomínio deve iniciar com letras.',
    }),
    ApiProperty({
      description: 'Subdomain format',
      type: String,
      pattern: RegExp(Regex.SUBDOMAIN).toString(),
      example: 'foo, foobar, foobar123, hello123world',
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
