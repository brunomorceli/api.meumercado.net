import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule, ProductsModule } from '@App/modules';
import { BucketsModule, TenantIdMiddleware } from './shared';
import { CompaniesModule } from './modules/companies';

@Module({
  imports: [BucketsModule, UsersModule, CompaniesModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantIdMiddleware).forRoutes('*');
  }
}
