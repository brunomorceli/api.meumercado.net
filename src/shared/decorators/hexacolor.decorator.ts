import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsHexColor } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

export const HexacolorDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsHexColor(),
    IsString(),
    ApiProperty({
      description: 'Hexacolor format.',
      example: '#f3f3f3',
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
