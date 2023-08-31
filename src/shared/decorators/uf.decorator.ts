import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export enum EBrazilianUF {
  AC = 'AC',
  AL = 'AL',
  AP = 'AP',
  AM = 'AM',
  BA = 'BA',
  CE = 'CE',
  DF = 'DF',
  ES = 'ES',
  GO = 'GO',
  MA = 'MA',
  MT = 'MT',
  MS = 'MS',
  MG = 'MG',
  PA = 'PA',
  PB = 'PB',
  PR = 'PR',
  PE = 'PE',
  PI = 'PI',
  RJ = 'RJ',
  RN = 'RN',
  RS = 'RS',
  RO = 'RO',
  RR = 'RR',
  SC = 'SC',
  SP = 'SP',
  SE = 'SE',
  TO = 'TO',
}

export const UFDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const keys = Object.keys(EBrazilianUF);
  const decorators = [
    IsEnum(EBrazilianUF),
    ApiProperty({
      description: `Brazilian UF - valid options: [${keys.join(', ')}]`,
      example: keys[0],
    }),
  ];

  if (data?.empty !== true) {
    decorators.push(IsNotEmpty());
  }

  if (data?.required === false) {
    decorators.push(IsOptional());
  }

  return applyDecorators(...decorators);
};
