import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto, PrismaService } from '@App/shared';
import { OrderEntity } from './entities';
import { CreateOrderDto, FindOrderResultDto } from './dtos';
import { Order, OrderStatus, User } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User, data: CreateOrderDto): Promise<OrderEntity> {
    const order: Order = await this.prismaService.$transaction(
      async (prisma) => {
        const order = await prisma.order.create({
          data: {
            companyId: user.companyId,
            userId: user.id,
            observation: data.observation,
            status: OrderStatus.PENDING,
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
            orderProducts: { include: { product: true } },
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
}
