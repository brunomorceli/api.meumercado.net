import { Regex } from '@App/utils';
import { ApiProperty } from '@nestjs/swagger';
import { SkuStatusType, StrategyStatusType, ThemeType } from '@prisma/client';
import { IsEnum, IsObject, IsString, IsUUID, Matches } from 'class-validator';

export class CreateStrategyDto {
  @ApiProperty()
  @IsString()
  public label: string;

  @ApiProperty()
  @IsString()
  public search: string;

  @ApiProperty()
  @IsEnum(ThemeType)
  public theme: ThemeType;

  @ApiProperty()
  @IsObject()
  public themeData: any;

  @ApiProperty()
  @IsEnum(StrategyStatusType)
  public status: StrategyStatusType;

  @ApiProperty()
  @Matches(Regex.ISO_DATE)
  public startsAt: string;

  @ApiProperty()
  @Matches(Regex.ISO_DATE)
  public endsAt?: string;

  @ApiProperty()
  @IsUUID()
  public placeId: string;
}
