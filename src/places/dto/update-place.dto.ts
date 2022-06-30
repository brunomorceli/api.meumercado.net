import { ApiProperty } from '@nestjs/swagger';
import { PlaceStatusType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdatePlaceDto {
  @ApiProperty()
  @IsString()
  public label: string;

  @ApiProperty()
  @IsEnum(PlaceStatusType)
  @IsOptional()
  public status?: PlaceStatusType;
}
