import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [AdminsModule, CustomersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
