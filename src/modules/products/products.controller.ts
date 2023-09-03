import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Param,
  Query,
  Patch,
  Delete,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateProductDto,
  FindProductDto,
  FindProductResultDto,
  UpdateProductDto,
} from './dtos';
import { ProductEntity } from './entities/product.entity';
import { IdParamDto } from '@App/shared';

@ApiTags('products')
@ApiBearerAuth('access-token')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Req() req: any,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.create(req.user, createProductDto);
  }

  @Patch()
  update(
    @Req() req: any,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.update(req.user, updateProductDto);
  }

  @Get(':id/get')
  get(@Req() req: any, @Param() props: IdParamDto): Promise<ProductEntity> {
    return this.productsService.get(req.user, props.id);
  }

  @Get('find')
  find(
    @Res({ passthrough: true }) res,
    @Req() req,
    @Query() findProductDto: FindProductDto,
  ): Promise<FindProductResultDto> {
    console.log('subdomain:', res.locals.subdomain);
    return this.productsService.find(req.user, findProductDto);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param() props: IdParamDto): Promise<void> {
    return this.productsService.delete(req.user, props.id);
  }
}
