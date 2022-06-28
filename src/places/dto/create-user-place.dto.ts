import { ApiProperty } from '@nestjs/swagger';
import { RoleType, UserPlaceStatusType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateUserPlaceDto {
  @ApiProperty()
  @IsEnum(RoleType)
  public role: RoleType;

  @ApiProperty()
  @IsEnum(UserPlaceStatusType)
  public status: UserPlaceStatusType;
}
