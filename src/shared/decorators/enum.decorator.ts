import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';

interface EnumDecoratorProps extends DefaultPropertyDecoratorOptions {
  enumType: any;
}

export const EnumDecorator = (data?: EnumDecoratorProps) => {
  const keys = Object.keys(data?.enumType || {});
  const decorators = [
    IsEnum(data?.enumType || {}),
    ApiProperty({
      description: `Enum Type (options: [${keys.join(', ')}]`,
      example: keys[0],
    }),
  ];

  if (data?.empty !== true) {
    decorators.push(IsNotEmpty());
  }

  if (data?.required === false) {
    decorators.push(IsOptional());
  }

  return applyDecorators(
    ...decorators,
    ...(data.decorators ? data.decorators : []),
  );
};
