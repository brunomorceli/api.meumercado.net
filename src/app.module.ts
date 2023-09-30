import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  UsersModule,
  ProductsModule,
  AuthModule,
  CompaniesModule,
} from '@App/admins';
import { BucketsModule, TenantIdMiddleware } from './shared';

@Module({
  imports: [
    BucketsModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantIdMiddleware).forRoutes('*');
  }
}
