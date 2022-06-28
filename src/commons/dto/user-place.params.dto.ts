import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserPlaceParamsDto {
  @ApiProperty()
  @IsUUID()
  public userId: string;

  @ApiProperty()
  @IsUUID()
  public placeId: string;
}
