import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule, CategoriesModule, ProductsModule } from '@App/modules';
import { BucketsModule, SubdomainMiddleware } from './shared';
import { CompaniesModule } from './modules/companies';

@Module({
  imports: [
    BucketsModule,
    UsersModule,
    CompaniesModule,
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SubdomainMiddleware).forRoutes('*');
  }
}
