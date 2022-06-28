import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SkusService } from './skus.service';
import { CreateSkusDto } from './dto/create-skus.dto';
import { UpdateSkusDto } from './dto/update-skus.dto';
import { ApiTags } from '@nestjs/swagger';
import { SkuId } from '@App/commons';

@ApiTags('skus')
@Controller('skus')
export class SkusController {
  constructor(private readonly skusService: SkusService) {}

  @Post()
  create(@Body() createSkusDto: CreateSkusDto) {
    return this.skusService.create(createSkusDto);
  }

  @Get(':skuId')
  findOne(@Param() params: SkuId) {
    return this.skusService.findOne(params.skuId);
  }

  @Patch()
  update(@Body() updateSkusDto: UpdateSkusDto) {
    return this.skusService.update(updateSkusDto);
  }

  @Delete(':skuId')
  remove(@Param() params: SkuId) {
    return this.skusService.remove(params.skuId);
  }
}
