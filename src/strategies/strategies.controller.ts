import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Strategy } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { StrategyId } from '@App/commons';

@ApiTags('strategies')
@Controller('strategies')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Post()
  create(@Body() createStrategyDto: CreateStrategyDto): Promise<Strategy> {
    return this.strategiesService.create(createStrategyDto);
  }

  @Get(':strategyId')
  findOne(@Param() params: StrategyId): Promise<Strategy> {
    return this.strategiesService.findOne(params.strategyId);
  }

  @Patch()
  update(@Body() updateStrategyDto: UpdateStrategyDto): Promise<Strategy> {
    return this.strategiesService.update(updateStrategyDto);
  }

  @Delete(':strategyId')
  remove(@Param() params: StrategyId): Promise<void> {
    return this.strategiesService.remove(params.strategyId);
  }
}
