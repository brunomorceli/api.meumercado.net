import {
  Controller,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Req,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '@App/shared';
import {
  CreateOrderDto,
  FindOrderDto,
  FindOrderResultDto,
  UpdateOrderDto,
} from './dtos';
import { OrderEntity } from './entities';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() data: CreateOrderDto): Promise<OrderEntity> {
    return this.ordersService.create(req.user.company.id, data);
  }

  @Patch()
  update(@Req() req: any, @Body() data: UpdateOrderDto): Promise<OrderEntity> {
    return this.ordersService.update(data);
  }

  @Get(':id/get')
  get(@Req() req: any, @Param() props: IdParamDto): Promise<OrderEntity> {
    return this.ordersService.get(req.user.company.id, props.id);
  }

  @Get('find')
  find(
    @Req() req: any,
    @Query() findOrderDto: FindOrderDto,
  ): Promise<FindOrderResultDto> {
    return this.ordersService.find(req.user.company.id, findOrderDto);
  }
}
