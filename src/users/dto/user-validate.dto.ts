import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserValidateDto {
  @ApiProperty()
  @IsString()
  public validationCode: string;
}

export class UserValidateResponse {
  @ApiProperty()
  @IsString()
  public token: string;
}
