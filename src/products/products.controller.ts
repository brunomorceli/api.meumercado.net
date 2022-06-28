import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductId } from '@App/commons';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get(':productId')
  findOne(@Param() params: ProductId) {
    return this.productsService.findOne(params.productId);
  }

  @Patch(':productId')
  update(
    @Param() params: ProductId,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(params.productId, updateProductDto);
  }

  @Delete(':productId')
  remove(@Param() params: ProductId) {
    return this.productsService.remove(params.productId);
  }
}
