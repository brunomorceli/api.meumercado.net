import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PrismaService } from '@App/prisma';
import { MessagesService } from '@App/messages';
import { PlacesController } from './places.controller';
import { ProductsService } from '@App/products/products.service';
import { StrategiesService } from '@App/strategies/strategies.service';

@Module({
  controllers: [PlacesController],
  providers: [
    PrismaService,
    MessagesService,
    ProductsService,
    PlacesService,
    StrategiesService,
  ],
})
export class PlacesModule {}
