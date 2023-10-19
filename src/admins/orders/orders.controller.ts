import {
  Controller,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NumberIdParamDto } from '@App/shared';
import { FindOrderDto, FindOrderResultDto, UpdateOrderDto } from './dtos';
import { OrderEntity } from './entities';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('admins/orders')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('admins'))
@Controller('admins/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Patch(':id')
  update(
    @Req() req: any,
    @Param() props: NumberIdParamDto,
    @Body() data: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersService.update(req.user, Number(props.id), data);
  }

  @Get(':id/get')
  get(@Req() req: any, @Param() props: NumberIdParamDto): Promise<OrderEntity> {
    return this.ordersService.get(req.user.company.id, Number(props.id));
  }

  @Get('find')
  find(
    @Req() req: any,
    @Query() findOrderDto: FindOrderDto,
  ): Promise<FindOrderResultDto> {
    return this.ordersService.find(req.user.company.id, findOrderDto);
  }
}
