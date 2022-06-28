import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InvitationResponse {
  @ApiProperty()
  @IsString()
  public token;
}
