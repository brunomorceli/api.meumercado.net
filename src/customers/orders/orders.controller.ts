import {
  Controller,
  Body,
  Get,
  Param,
  Req,
  Post,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdParamDto, PaginationDto } from '@App/shared';
import { CancelOrderDto, CreateOrderDto, FindOrderResultDto } from './dtos';
import { OrderEntity } from './entities';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('customers/orders')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('customers'))
@Controller('customers/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() data: CreateOrderDto): Promise<OrderEntity> {
    return this.ordersService.create(req.user, data);
  }

  @Get(':id/get')
  get(@Req() req: any, @Param() props: IdParamDto): Promise<OrderEntity> {
    return this.ordersService.get(req.user.company.id, props.id);
  }

  @Get('list')
  find(
    @Query() query: PaginationDto,
    @Req() req: any,
  ): Promise<FindOrderResultDto> {
    return this.ordersService.find(query, req.user.company.id, req.user.id);
  }

  @Put(':id/cancel')
  cancel(
    @Req() req: any,
    @Param() props: IdParamDto,
    @Body() data: CancelOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersService.cancel(req.user, data.observation, props.id);
  }
}
