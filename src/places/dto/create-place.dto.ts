import { ApiProperty } from '@nestjs/swagger';
import { PlaceStatusType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty()
  @IsUUID()
  public userId: string;

  @ApiProperty()
  @IsString()
  public label: string;

  @ApiProperty()
  @IsEnum(PlaceStatusType)
  @IsOptional()
  public status?: PlaceStatusType;
}
