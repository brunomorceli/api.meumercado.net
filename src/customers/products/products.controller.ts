import { Controller, Get, Req, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindProductDto, FindProductResultDto } from './dtos';

@ApiTags('customers/products')
@ApiBearerAuth('access-token')
@Controller('customers/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('find')
  find(
    @Req() req,
    @Query() findProductDto: FindProductDto,
  ): Promise<FindProductResultDto> {
    return this.productsService.find(req.user.company.id, findProductDto);
  }
}
