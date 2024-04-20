import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AdminsModule } from './admins/admins.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: Number(process.env.CACHE_TTL || 60 * 15),
      isGlobal: true,
    }),
    AdminsModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
