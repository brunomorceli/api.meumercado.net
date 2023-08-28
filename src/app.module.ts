import { Module } from '@nestjs/common';
import { UsersModule, CategoriesModule, ProductsModule } from '@App/modules';
import { BucketsModule } from './shared';

@Module({
  imports: [BucketsModule, UsersModule, CategoriesModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
