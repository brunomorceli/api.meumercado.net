import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateStrategyDto } from './create-strategy.dto';

export class UpdateStrategyDto extends PartialType(CreateStrategyDto) {
  @ApiProperty()
  @IsUUID()
  public id: string;
}
