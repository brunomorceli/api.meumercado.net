import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto, PrismaService } from '@App/shared';
import { OrderEntity } from './entities';
import { FindOrderDto, FindOrderResultDto, UpdateOrderDto } from './dtos';
import { OrderStatus, User } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async get(companyId: string, id: string): Promise<OrderEntity> {
    const order = await this.prismaService.order.findUnique({
      where: { companyId, id },
      include: {
        orderProducts: { include: { product: true } },
        payments: true,
        orderLogs: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    return new OrderEntity(order as any);
  }

  async find(
    companyId: string,
    data: FindOrderDto,
  ): Promise<FindOrderResultDto> {
    const { userId, status, ...rest } = data;
    const where: any = { ...rest, companyId, deletedAt: null };

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    const paginationData = FindOrderDto.getPaginationParams(
      data as PaginationDto,
    );

    const total = await this.prismaService.order.count({ where });

    const users = await this.prismaService.order.findMany({
      where,
      include: {
        orderProducts: { include: { product: true } },
        payments: true,
        orderLogs: { orderBy: { createdAt: 'asc' } },
      },
      skip: paginationData.skip,
      take: paginationData.limit,
    });

    return {
      page: paginationData.page,
      limit: paginationData.limit,
      total,
      data: users.map((c: any) => new OrderEntity(c)) || [],
    };
  }

  async update(user: User, data: UpdateOrderDto): Promise<OrderEntity> {
    const { id, ...updateData } = data;
    const existing: any = await this.prismaService.order.findFirst({
      where: { id },
    });

    if (!existing) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    const statusKeys = Object.keys(OrderStatus);
    if (
      updateData.status &&
      statusKeys.indexOf(data.status) <= statusKeys.indexOf(existing.status)
    ) {
      throw new HttpException(
        'O status deve ser uma progressão do anterior',
        HttpStatus.BAD_REQUEST,
      );
    }

    const order = await this.prismaService.$transaction(async (prisma) => {
      await prisma.orderLog.create({
        data: {
          orderId: id,
          userId: user.id,
          status: updateData.status,
          observation: updateData.observation,
        },
      });

      const order = await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          orderProducts: { include: { product: true } },
          payments: true,
          orderLogs: { orderBy: { createdAt: 'asc' } },
        },
      });

      return order;
    });

    return new OrderEntity(order as any);
  }
}
