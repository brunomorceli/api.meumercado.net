import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

export class EmailDto {
  @IsEmail()
  public email: string;

  @IsString()
  public subject: string;

  @IsObject()
  @IsOptional()
  public metadata: any;
}
