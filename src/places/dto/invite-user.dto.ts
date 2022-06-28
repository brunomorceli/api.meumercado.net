import { Regex } from '@App/utils';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsUUID, Matches } from 'class-validator';

export class InviteUserDto {
  @ApiProperty()
  @IsUUID()
  public placeId;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiProperty()
  @Matches(Regex.PHONE_NUMBER)
  @IsOptional()
  public phoneNumber?: string;

  @ApiProperty()
  @IsEnum(RoleType)
  public role: RoleType;
}
