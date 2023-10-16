import { Injectable } from '@nestjs/common';
import {
  CreateNotificationDto,
  FindNotificationDto,
  NotificationDto,
} from '@App/shared/modules/notifications';
import { PrismaService } from '../prisma';
import { NotificationTarget } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    companyId: string,
    data: CreateNotificationDto,
    prismaHandler?: any,
  ): Promise<void> {
    const prisma = prismaHandler || this.prismaService;

    await prisma.notification.create({
      data: { ...data, companyId },
    });
  }

  async find(
    companyId: string,
    target: NotificationTarget,
    data: FindNotificationDto,
  ): Promise<NotificationDto[]> {
    const query: any = {
      where: {
        companyId,
        target,
        id: { gt: Number(data.last) },
      },
      take: 20,
      orderBy: { id: 'desc' },
    };

    const notifications = await this.prismaService.notification.findMany(query);

    return notifications.map((n: any) => new NotificationDto(n));
  }
}
