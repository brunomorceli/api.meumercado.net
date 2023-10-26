import { Module } from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma';

@Module({
  providers: [PrismaService, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
