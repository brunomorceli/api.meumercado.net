import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AdminsModule } from './admins/admins.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    AdminsModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
