import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  UsersModule,
  ProductsModule,
  AuthModule,
  CompaniesModule,
} from '@App/customers';
import { BucketsModule, TenantIdMiddleware } from '../shared';
import { OrdersModule } from '@App/customers';

@Module({
  imports: [
    BucketsModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class CustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantIdMiddleware).forRoutes('*');
  }
}
