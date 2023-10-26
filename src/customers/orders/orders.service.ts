import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  NotificationsService,
  PaginationDto,
  PrismaService,
} from '@App/shared';
import { OrderEntity } from './entities';
import { CreateOrderDto, FindOrderResultDto } from './dtos';
import {
  NotificationTarget,
  NotificationType,
  OrderStatus,
  Product,
  User,
} from '@prisma/client';
import { CheckStockResultDto } from './dtos/check-stock.result.dto';
import { CheckStockDto } from './dtos/check-stock.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {}

  async checkStock(
    companyId: string,
    data: CheckStockDto,
    prismaHandler?: any,
  ): Promise<CheckStockResultDto> {
    const result: CheckStockResultDto = { products: [], unlimitedProducts: [] };

    const prisma = prismaHandler || this.prismaService;

    for (const i in data.products) {
      const op = data.products[i];

      const product: Product = await prisma.product.findFirst({
        where: { id: op.productId, companyId },
      });

      if (product.unlimited) {
        result.unlimitedProducts.push(product.id);
        continue;
      }

      if (product.quantity < op.quantity) {
        result.products.push({
          productId: op.productId,
          quantity: product.quantity,
        });
      }
    }

    return result;
  }

  async create(user: User, data: CreateOrderDto): Promise<OrderEntity> {
    const order = await this.prismaService.$transaction(async (prisma) => {
      const status = OrderStatus.PENDING;
      const order = await prisma.order.create({
        data: {
          companyId: user.companyId,
          userId: user.id,
          observation: data.observation,
          status,
        },
      });

      await prisma.orderProduct.createMany({
        data: data.orderProducts.map((product) => ({
          ...product,
          orderId: order.id,
        })),
      });

      const outOfStock = await this.checkStock(
        user.companyId,
        { products: data.orderProducts },
        prisma,
      );

      if (outOfStock.products.length !== 0) {
        throw new HttpException(
          'Alguns produtos se encontram fora de estoque',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      await Promise.all(
        data.orderProducts
          .filter((op) => !outOfStock.unlimitedProducts.includes(op.productId))
          .map(async (op) =>
            prisma.product.update({
              where: { id: op.productId },
              data: { quantity: { decrement: op.quantity } },
            }),
          ) || [],
      );

      await prisma.payment.createMany({
        data: data.payments.map((payment) => ({
          ...payment,
          orderId: order.id,
        })),
      });

      await prisma.orderLog.create({
        data: {
          orderId: order.id,
          userId: user.id,
          status,
        },
      });

      await this.notificationService.create(
        order.companyId,
        {
          orderId: order.id,
          label: `Nova compra de "${user.name}".`,
          target: NotificationTarget.COMPANY,
          type: NotificationType.NEW_ORDER,
        },
        prisma,
      );

      return await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          orderProducts: { include: { product: true } },
          payments: true,
          orderLogs: { orderBy: { createdAt: 'asc' } },
        },
      });
    });

    return new OrderEntity(order as any);
  }

  async get(companyId: string, id: number): Promise<OrderEntity> {
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
    paginationDto: PaginationDto,
    companyId: string,
    userId: string,
  ): Promise<FindOrderResultDto> {
    const where: any = {
      companyId,
      userId,
      deletedAt: null,
    };

    const paginationData = PaginationDto.getPaginationParams(paginationDto);
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
      orderBy: { createdAt: 'desc' },
    });

    return {
      page: paginationData.page,
      limit: paginationData.limit,
      total,
      data: users.map((c: any) => new OrderEntity(c)) || [],
    };
  }

  async cancel(
    user: User,
    observation: string,
    orderId: number,
  ): Promise<OrderEntity> {
    const existing: any = await this.prismaService.order.findFirst({
      where: { id: orderId, userId: user.id },
    });

    if (
      !existing ||
      ![OrderStatus.PENDING, OrderStatus.PREPARING].includes(existing.status)
    ) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    const order = await this.prismaService.$transaction(async (prisma) => {
      const status = OrderStatus.CANCELED_BY_CLIENT;

      await prisma.orderLog.create({
        data: {
          orderId,
          userId: user.id,
          status,
          observation,
        },
      });

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
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
