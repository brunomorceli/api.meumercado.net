import { Module } from '@nestjs/common';
import { UsersModule } from '@App/users';
import { MessagesModule } from '@App/messages';
import { StrategiesModule } from '@App/strategies/strategies.module';
import { PlacesModule } from '@App/places/places.module';
import { BrandsModule } from '@App/brands/brands.module';
import { ProductsModule } from '@App/products/products.module';
import { SkusModule } from '@App/skus/skus.module';

@Module({
  imports: [
    UsersModule,
    MessagesModule,
    StrategiesModule,
    PlacesModule,
    BrandsModule,
    ProductsModule,
    SkusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
