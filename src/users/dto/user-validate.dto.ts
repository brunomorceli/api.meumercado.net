import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsObject, IsString } from 'class-validator';

export class UserValidateDto {
  @ApiProperty()
  @IsString()
  public validationCode: string;
}

export class UserValidateResponse {
  @ApiProperty()
  @IsObject()
  user: User;

  @ApiProperty()
  @IsString()
  public token: string;
}
