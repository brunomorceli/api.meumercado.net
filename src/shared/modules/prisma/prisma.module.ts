import { Module } from '@nestjs/common';
import { PrismaService } from '@App/shared/modules';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
