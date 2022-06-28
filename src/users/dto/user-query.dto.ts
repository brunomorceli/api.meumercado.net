import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserStatusType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Validation } from 'src/utils';

export class UsersQuery {
  @Transform(({ value }) => Validation.get(value).toNumber(1).build())
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public id?: number;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public fullName?: string;

  @ApiProperty()
  @IsEnum(UserStatusType, { each: true })
  @IsOptional()
  public status: Array<UserStatusType>;

  @Transform(({ value }) => Validation.get(value).toNumber(0).build())
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public skip?: number;

  @Transform(({ value }) => Validation.get(value).toNumber(1, 150).build())
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public limit?: number;
}
