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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePlaceDto } from '@App/places/dto/create-place.dto';
import { PlacesService } from '@App/places/places.service';
import { UpdatePlaceDto } from '@App/places/dto/update-place.dto';
import { PlaceId } from '@App/commons';
import { ProductsService } from '@App/products/products.service';

@ApiTags('places')
@Controller('places')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class PlacesController {
  constructor(
    @Inject(forwardRef(() => PlacesService))
    private readonly placesService: PlacesService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get(':placeId')
  findAll(@Param() params: PlaceId) {
    return this.placesService.findAll(params.placeId);
  }

  @Get(':placeId')
  findOne(@Param() params: PlaceId) {
    return this.placesService.findOne(params.placeId);
  }

  @Patch(':placeId')
  update(@Param() params: PlaceId, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(params.placeId, updatePlaceDto);
  }

  @Delete(':placeId')
  remove(@Param() params: PlaceId): Promise<void> {
    return this.placesService.remove(params.placeId);
  }

  @Get(':placeId/invitations')
  findAllInvitations(@Param() params: PlaceId) {
    return this.placesService.findAllInvitations(params.placeId);
  }

  @Get(':placeId/products')
  findAllProducts(@Param() params: PlaceId) {
    return this.productsService.findAll(params.placeId);
  }
}
