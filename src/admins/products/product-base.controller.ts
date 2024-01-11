import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindProductBaseDto, FindProductBaseResultDto } from './dtos';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('admins/product-bases')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('admins'))
@Controller('admins/product-bases')
export class ProductBasesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('find')
  findProductBase(
    @Query() query: FindProductBaseDto,
  ): Promise<FindProductBaseResultDto> {
    return this.productsService.findProductBase(query);
  }
}
