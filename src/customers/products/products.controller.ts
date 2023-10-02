import { Controller, Get, Query, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';
import { FindProductDto, FindProductResultDto } from './dtos';

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
}
