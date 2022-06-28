import { ApiProperty } from '@nestjs/swagger';
import { BrandStatusType } from '@prisma/client';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  public label: string;

  @ApiProperty()
  @IsEnum(BrandStatusType)
  public status: BrandStatusType;

  @ApiProperty()
  @IsUUID()
  public placeId: string;
}
