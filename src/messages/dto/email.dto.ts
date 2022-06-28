import { IsEmail, IsObject, IsOptional } from 'class-validator';

export class EmailDto {
  @IsEmail()
  public email: string;

  @IsObject()
  @IsOptional()
  public metadata: any;
}
