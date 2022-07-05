import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePlaceDto } from '@App/places/dto/create-place.dto';
import { PlacesService } from '@App/places/places.service';
import { UpdatePlaceDto } from '@App/places/dto/update-place.dto';
import { PlaceId } from '@App/commons';
import { ProductsService } from '@App/products/products.service';
import { StrategiesService } from '@App/strategies/strategies.service';
import { Invitation, Place, Product, Strategy } from '@prisma/client';

@ApiTags('places')
@Controller('places')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class PlacesController {
  constructor(
    @Inject(forwardRef(() => PlacesService))
    private readonly placesService: PlacesService,
    private readonly productsService: ProductsService,
    private readonly strategiesService: StrategiesService,
  ) {}

  @Post()
  create(@Req() req: any, @Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(req.user.ownerId, createPlaceDto);
  }

  @Get(':placeId')
  findOne(@Param() params: PlaceId): Promise<Place> {
    return this.placesService.findOne(params.placeId);
  }

  @Get()
  async getAllPlaces(@Req() req): Promise<Array<Place>> {
    return await this.placesService.findAll(req.user.ownerId);
  }

  @Patch(':placeId')
  update(
    @Param() params: PlaceId,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<Place> {
    return this.placesService.update(params.placeId, updatePlaceDto);
  }

  @Delete(':placeId')
  remove(@Param() params: PlaceId): Promise<void> {
    return this.placesService.remove(params.placeId);
  }

  @Get(':placeId/invitations')
  findAllInvitations(@Param() params: PlaceId): Promise<Array<Invitation>> {
    return this.placesService.findAllInvitations(params.placeId);
  }

  @Get(':placeId/products')
  findAllProducts(@Param() params: PlaceId): Promise<Array<Product>> {
    return this.productsService.findAll(params.placeId);
  }

  @Get(':placeId/strategies')
  findAllStrategies(@Param() params: PlaceId): Promise<Array<Strategy>> {
    return this.strategiesService.findAll(params.placeId);
  }
}
