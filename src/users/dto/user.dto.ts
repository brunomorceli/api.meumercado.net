import { Regex } from 'src/utils';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserStatusType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Validation } from 'src/utils';

export class UserDto {
  @Transform(({ value }) => Validation.get(value).toNumber(1).build())
  @ApiProperty()
  @IsNumber()
  public id: number;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiProperty()
  @Matches(Regex.PHONE_NUMBER)
  @IsString()
  public phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public fullName?: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  public avatar?: string;

  @ApiProperty()
  @IsEnum(UserStatusType)
  public status: UserStatusType;
}
