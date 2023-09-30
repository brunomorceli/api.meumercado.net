import { UuidDecorator } from '@App/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ConfirmDto {
  @ApiProperty({
    example: '123ab',
    required: true,
    description: 'Confirmation code.',
  })
  @IsString()
  @Length(5, 5)
  confirmationCode: string;

  @UuidDecorator()
  authId: string;
}
