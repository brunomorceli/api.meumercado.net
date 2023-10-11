import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto, PrismaService } from '@App/shared';
import { OrderEntity } from './entities';
import {
  CreateOrderDto,
  FindOrderDto,
  FindOrderResultDto,
  UpdateOrderDto,
} from './dtos';
import { Order, OrderStatus, User } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  private getDateByStatus(status: OrderStatus): any {
    switch (status) {
      case OrderStatus.PENDING:
        return { pendingAt: new Date() };
      case OrderStatus.PREPARING:
        return { preparingAt: new Date() };
      case OrderStatus.SHIPPING:
        return { shippingAt: new Date() };
      case OrderStatus.DELIVERING:
        return { deliveringAt: new Date() };
      case OrderStatus.DONE:
        return { doneAt: new Date() };
      case OrderStatus.CANCELED_BY_COMPANY:
        return { canceledByCompanyAt: new Date() };
      case OrderStatus.CANCELED_BY_CLIENT:
        return { canceledByClientAt: new Date() };
    }
  }

  async create(user: User, data: CreateOrderDto): Promise<OrderEntity> {
    const order: Order = await this.prismaService.$transaction(
      async (prisma) => {
        const order = await prisma.order.create({
          data: {
            companyId: user.companyId,
            userId: user.id,
            observation: data.observation,
            status: OrderStatus.PENDING,
            ...this.getDateByStatus(OrderStatus.PENDING),
          },
        });

        await prisma.orderProduct.createMany({
          data: data.products.map((product) => ({
            ...product,
            orderId: order.id,
          })),
        });

        await prisma.payment.createMany({
          data: data.payments.map((payment) => ({
            ...payment,
            orderId: order.id,
          })),
        });

        return await prisma.order.findUnique({
          where: { id: order.id },
          include: {
            orderProducts: true,
            payments: true,
          },
        });
      },
    );

    return new OrderEntity(order);
  }

  async get(companyId: string, id: string): Promise<OrderEntity> {
    const order = await this.prismaService.order.findUnique({
      where: { companyId, id },
      include: {
        orderProducts: true,
        payments: true,
      },
    });

    if (!order) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    return new OrderEntity(order);
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
        orderProducts: true,
        payments: true,
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

  async update(data: UpdateOrderDto): Promise<OrderEntity> {
    const { id, ...rest } = data;
    let updateData: any = { ...rest };
    let order: any = await this.prismaService.order.findFirst({
      where: { id },
    });

    if (!order) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    if (updateData.status) {
      updateData = {
        ...updateData,
        ...this.getDateByStatus(updateData.status),
      };
    }

    order = await this.prismaService.order.update({
      where: { id },
      data: updateData,
      select: {
        orderProducts: true,
        payments: true,
      },
    });

    return new OrderEntity(order);
  }
}
