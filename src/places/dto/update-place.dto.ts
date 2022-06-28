import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UpdatePlaceDto {
  @ApiProperty()
  @IsString()
  public label: string;
}
