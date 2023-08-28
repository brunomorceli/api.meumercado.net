import { Regex } from '@App/shared/utils';
import { IsObject, IsOptional, IsString, Matches } from 'class-validator';

export class SmsDto {
  @Matches(Regex.PHONE_NUMBER)
  @IsString()
  public phoneNumber: string;

  @IsObject()
  @IsOptional()
  public metadata: any;
}
