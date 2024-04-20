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
  PrismaService,
  TenantIdMiddleware,
} from '../shared';
import { JwtService } from '@nestjs/jwt';

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
  providers: [JwtService, PrismaService],
})
export class AdminsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantIdMiddleware).forRoutes('*');
    consumer.apply(PlanMiddleware).forRoutes('*');
  }
}
