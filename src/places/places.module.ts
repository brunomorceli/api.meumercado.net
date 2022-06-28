import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PrismaService } from '@App/prisma';
import { MessagesService } from '@App/messages';
import { PlacesController } from './places.controller';
import { ProductsService } from '@App/products/products.service';

@Module({
  controllers: [PlacesController],
  providers: [PrismaService, MessagesService, ProductsService, PlacesService],
})
export class PlacesModule {}
