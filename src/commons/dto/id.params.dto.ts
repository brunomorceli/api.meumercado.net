import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class InvitationId {
  @ApiProperty()
  @IsUUID()
  public invitationId: string;
}

export class UserId {
  @ApiProperty()
  @IsUUID()
  public userId: string;
}

export class PlaceId {
  @ApiProperty()
  @IsUUID()
  public placeId: string;
}

export class UserPlaceId {
  @ApiProperty()
  @IsUUID()
  public userPlaceId: string;
}

export class ProductId {
  @ApiProperty()
  @IsUUID()
  public productId: string;
}

export class SkuId {
  @ApiProperty()
  @IsUUID()
  public skuId: string;
}

export class StrategyId {
  @ApiProperty()
  @IsUUID()
  public strategyId: string;
}

export class BrandId {
  @ApiProperty()
  @IsUUID()
  public brandId: string;
}
