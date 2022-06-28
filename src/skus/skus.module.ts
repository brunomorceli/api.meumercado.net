import { Module } from '@nestjs/common';
import { SkusService } from './skus.service';
import { SkusController } from './skus.controller';
import { PrismaService } from '@App/prisma';

@Module({
  controllers: [SkusController],
  providers: [PrismaService, SkusService],
})
export class SkusModule {}
