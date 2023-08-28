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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateCategoryDto,
  FindCategoryDto,
  FindCategoryResultDto,
  UpdateCategoryDto,
} from './dtos';
import { CategoryEntity } from './entities/category.entity';
import { IdParamDto } from '@App/shared';

@ApiTags('categories')
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Req() req: any,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoriesService.create(req.user, createCategoryDto);
  }

  @Patch()
  update(
    @Req() req: any,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoriesService.update(req.user, updateCategoryDto);
  }

  @Get(':id/get')
  get(@Req() req: any, @Param() props: IdParamDto): Promise<CategoryEntity> {
    return this.categoriesService.get(req.user, props.id);
  }

  @Get('find')
  find(
    @Req() req: any,
    @Query() findCategoryDto: FindCategoryDto,
  ): Promise<FindCategoryResultDto> {
    return this.categoriesService.find(req.user, findCategoryDto);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param() props: IdParamDto): Promise<void> {
    return this.categoriesService.delete(req.user, props.id);
  }
}
