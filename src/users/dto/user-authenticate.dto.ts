import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { Regex } from 'src/utils';

export class UserAuthenticateDto {
  @ApiProperty({
    example: 'usuario@email.com',
    required: false,
    description: 'email',
  })
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiProperty({
    example: '(11)954781128',
    required: false,
    description: 'Phone Number',
  })
  @Matches(Regex.PHONE_NUMBER)
  @IsString()
  @IsOptional()
  public phoneNumber?: string;

  @ApiProperty({
    example: '38dab465-2d8c-4cf0-a6dc-bfb6b20fe9b9',
    required: false,
    description: 'Unique ID from a third party like Google or Twitch.',
  })
  @IsUUID()
  @IsOptional()
  public thirdPartyId?: any;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    required: false,
    description: 'Token from a third party like Google or Twitch.',
  })
  @IsString()
  @IsOptional()
  public thirdPartyToken?: any;

  @ApiProperty({
    description: 'Place to pass extra data if necessary',
    required: false,
    example: '{ foo: "bar" }',
  })
  @IsObject()
  @IsOptional()
  public metadata?: any;

  @ApiProperty({
    enum: AuthType,
    default: AuthType.EMAIL,
  })
  @IsEnum(AuthType)
  public authType: AuthType;
}
