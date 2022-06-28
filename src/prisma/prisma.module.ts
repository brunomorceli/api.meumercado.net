import { Module } from '@nestjs/common';

import { PrismaService } from '@App/prisma';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
