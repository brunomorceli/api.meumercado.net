import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class InviteUserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  public email?: string;
}
