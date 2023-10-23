import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';
import { FindProductDto, FindProductResultDto } from './dtos';
import { IdParamDto } from '@App/shared';
import { ProductEntity } from '@App/admins';

@ApiTags('customers/products')
@Controller('customers/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('find')
  find(
    @Res({ passthrough: true }) res,
    @Query() findProductDto: FindProductDto,
  ): Promise<FindProductResultDto> {
    return this.productsService.find(res.locals.tenantId, findProductDto);
  }

  @Get(':id/get')
  get(
    @Res({ passthrough: true }) res,
    @Param() props: IdParamDto,
  ): Promise<ProductEntity> {
    return this.productsService.get(res.locals.tenantId, props.id);
  }
}
