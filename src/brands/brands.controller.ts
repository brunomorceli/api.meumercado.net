import { BrandId } from '@App/commons';
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Brand } from '@prisma/client';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('brands')
@Controller('brands')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
  }

  @Patch()
  update(@Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(updateBrandDto);
  }

  @Delete(':brandId')
  remove(@Param() params: BrandId) {
    return this.brandsService.remove(params.brandId);
  }
}
