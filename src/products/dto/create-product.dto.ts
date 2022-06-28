import { ApiProperty } from '@nestjs/swagger';
import { ProductStatusType } from '@prisma/client';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  public label: string;

  @ApiProperty()
  @IsString()
  public search: string;

  @ApiProperty()
  @IsEnum(ProductStatusType)
  public status: ProductStatusType;

  @ApiProperty()
  @IsUUID()
  public placeId: string;

  @ApiProperty()
  @IsUUID()
  public brandId: string;
}
