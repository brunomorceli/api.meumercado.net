import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  NotificationsService,
  PaginationDto,
  PrismaService,
} from '@App/shared';
import { FindOrderEntity, OrderEntity } from './entities';
import { FindOrderDto, FindOrderResultDto, UpdateOrderDto } from './dtos';
import {
  NotificationTarget,
  NotificationType,
  OrderStatus,
  User,
} from '@prisma/client';
import * as Slug from 'slug';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {}

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
    let where = `where o.company_id = '${companyId}'`;

    if (data.userId) {
      where += ` and u.id = '${data.userId}'`;
    }

    if (data.userName) {
      where += ` and u.slug ilike('${Slug(data.userName)}%')`;
    }

    if (data.status) {
      where += ` and o.status = '${data.status}'`;
    }

    if (data.cpfCnpj) {
      where += ` and u."cpfCnpj" ilike('${data.cpfCnpj}%')`;
    }

    if (data.productName) {
      where += ` and p.slug ilike('${Slug(data.productName)}%')`;
    }

    const paginationData = FindOrderDto.getPaginationParams(
      data as PaginationDto,
    );

    const sql = `
        select
        distinct o.id,
        o.company_id as "companyId",
        o.observation,
        u.name as "userName",
        u.id as "userId",
        u.cpf_cnpj as "cpfCnpj",
        cast((select sum(op.price * op.quantity) from order_products as op where op.order_id = o.id) as text) as total,
        cast((select count(id) from order_products as op where op.order_id = o.id) as text) as "productCount",
        o.status,
        o.created_at as "createdAt"
      from orders as o
      inner join users as u on u.id = o.user_id
      inner join order_products as op on op.order_id = o.id
      inner join products as p on p.id = op.product_id
      ${where}
      order by o.created_at ${data.orderBy || 'desc'}
      offset ${paginationData.skip}
      limit ${paginationData.limit};
    `;

    const orders = await this.prismaService.$queryRawUnsafe(sql);

    return {
      page: paginationData.page,
      limit: paginationData.limit,
      total: 0,
      data: ((orders as any[]).map((c: any) => {
        delete c.user;
        return new FindOrderEntity(c);
      }) || []) as any,
    };
  }

  async update(
    user: User,
    orderId: string,
    data: UpdateOrderDto,
  ): Promise<OrderEntity> {
    const updateData = { ...data };
    const existing: any = await this.prismaService.order.findFirst({
      where: { id: orderId },
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
          orderId,
          userId: user.id,
          status: updateData.status,
          observation: updateData.observation,
        },
      });

      const order = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          orderProducts: { include: { product: true } },
          payments: true,
          orderLogs: { orderBy: { createdAt: 'asc' } },
        },
      });

      await this.notificationService.create(
        order.companyId,
        {
          orderId: order.id,
          label: `O status da sua compra foi alterado para "${OrderEntity.getLabel(
            data.status,
          )}"`,
          target: NotificationTarget.CLIENT,
          type: NotificationType.UPDATE_ORDER,
        },
        prisma,
      );

      return order;
    });

    return new OrderEntity(order as any);
  }
}
