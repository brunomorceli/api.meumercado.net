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
  MessagesModule,
  NotificationsModule,
  PagarmeModule,
  PagarmeService,
  PlanMiddleware,
  PrismaService,
  TenantIdMiddleware,
} from '../shared';
import { JwtService } from '@nestjs/jwt';
import { CompaniesService } from '@App/customers';
import { AuthService } from '@App/customers/auth/auth.service';

@Module({
  imports: [
    NotificationsModule,
    MessagesModule,
    PagarmeModule,
    BucketsModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [
    JwtService,
    PagarmeService,
    PrismaService,
    CompaniesService,
    AuthService,
  ],
})
export class AdminsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantIdMiddleware).forRoutes('*');
    consumer.apply(PlanMiddleware).forRoutes('*');
  }
}
