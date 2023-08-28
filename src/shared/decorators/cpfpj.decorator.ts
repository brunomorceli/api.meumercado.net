import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';
import { Regex } from '../utils';

export const CpfCnpjDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsString(),
    Matches(Regex.CPF_CNPJ_CLEAR),
    ApiProperty({
      description: 'CPF or CNPJ number',
      pattern: RegExp(Regex.CPF_CNPJ_CLEAR).toString(),
      type: String,
      example: 'CPF: 99999999999 or CNPJ: 99999999999999',
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
