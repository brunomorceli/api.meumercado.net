import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class AuthenticateUserDto {
  @ApiProperty({
    example: 'email@email.com',
    required: false,
    description: 'email',
  })
  @IsEmail()
  @IsOptional()
  public email?: string;
}
