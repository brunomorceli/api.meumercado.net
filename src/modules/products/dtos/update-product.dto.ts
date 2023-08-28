import { EnumDecorator, StringDecorator, UuidDecorator } from '@App/shared';
import { ProductStatusType } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @UuidDecorator()
  id: string;

  @StringDecorator({ required: false })
  label?: string;

  @StringDecorator({ required: false })
  description?: string;

  @IsString()
  @IsOptional()
  blob?: string;

  @EnumDecorator({ enumType: ProductStatusType, required: false })
  status?: ProductStatusType;
}
