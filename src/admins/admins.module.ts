import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  UsersModule,
  ProductsModule,
  AuthModule,
  CompaniesModule,
  OrdersModule,
} from '@App/admins';
import {
  BucketsModule,
  NotificationsModule,
  PlanMiddleware,
  TenantIdMiddleware,
} from '../shared';

@Module({
  imports: [
    NotificationsModule,
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
export class AdminsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantIdMiddleware).forRoutes('*');
    consumer.apply(PlanMiddleware).forRoutes('*');
  }
}
