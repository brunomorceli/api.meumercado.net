import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { DefaultPropertyDecoratorOptions } from './default-property-decorator-options';
import axios from 'axios';

const mimesDefault = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp'];

interface IsFileOptions {
  mimes: string[];
  description?: string;
}

export const IsUrlInMimetype = (
  options: IsFileOptions,
  validationOptions?: ValidationOptions,
) => {
  return function (object: unknown, propertyName: string) {
    return registerDecorator({
      name: 'IsUrlInMimetype',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: any) {
          const imageValidation = await axios
            .get(value, {
              responseType: 'arraybuffer',
            })
            .catch(() => null);
          const imageType = imageValidation?.headers['content-type'];
          const optionsWithValidation = options.mimes || mimesDefault;
          return (
            optionsWithValidation?.findIndex(
              (type) => type === imageType?.split('/')[1],
            ) !== -1
          );
        },
      },
    });
  };
};

export const ImageUrlDecorator = (data?: DefaultPropertyDecoratorOptions) => {
  const decorators = [
    IsUrl(),
    ApiProperty({
      description: 'Simple Image url',
      type: String,
      example: 'http://foobar.com/image.png',
      ...data,
    }),
  ];

  if (process.env.NODE_ENV !== 'test') {
    decorators.push(
      IsUrlInMimetype(
        {
          mimes: data?.imageMimesType || mimesDefault,
        },
        { message: 'invalid image url' },
      ),
    );
  }

  if (data && data.empty !== true) {
    decorators.push(IsNotEmpty());
  }

  if (data && data.required === false) {
    decorators.push(IsOptional());
  }

  return applyDecorators(...decorators, ...((data || {}).decorators || []));
};
