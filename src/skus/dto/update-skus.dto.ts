import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateSkusDto } from './create-skus.dto';

export class UpdateSkusDto extends PartialType(CreateSkusDto) {
  @ApiProperty()
  @IsUUID()
  public id: string;
}
