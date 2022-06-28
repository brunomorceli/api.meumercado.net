import { ApiProperty } from '@nestjs/swagger';
import { SkuStatusType } from '@prisma/client';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateSkusDto {
  @ApiProperty()
  @IsString()
  public label: string;

  @ApiProperty()
  @IsString()
  public search: string;

  @ApiProperty()
  @IsEnum(SkuStatusType)
  public status: SkuStatusType;

  @ApiProperty()
  @IsUUID()
  public productId: string;
}
