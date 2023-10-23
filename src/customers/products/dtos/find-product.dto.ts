import { PaginationDto, StringDecorator } from '@App/shared';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class FindProductDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  @IsArray()
  categories?: string[];

  @StringDecorator({ required: false, minLength: 3 })
  label?: string;
}
