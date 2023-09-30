import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoleType, User } from '@prisma/client';
import { PrismaService, PaginationDto } from '@App/shared';
import { CreateUserDto, FindUserDto, UpdateUserDto } from './dtos';
import { UserEntity } from './entities';
import * as Slug from 'slug';
import { FindUserResultDto } from './dtos/find-user-result.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async get(companyId: string, userId: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId, companyId },
    });
    if (!user) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    return new UserEntity(user);
  }

  async find(
    companyId: string,
    findCompanyUserDto: FindUserDto,
  ): Promise<FindUserResultDto> {
    const { name, email, roles, phoneNumber, cpfCnpj, ...rest } =
      findCompanyUserDto;
    const where: any = { ...rest, companyId, deletedAt: null };

    if (name) {
      where.slug = { startsWith: Slug(name) };
    }

    if (email) {
      where.email = { startsWith: email };
    }

    if (phoneNumber) {
      where.phoneNumber = { startsWith: phoneNumber };
    }

    if (cpfCnpj) {
      where.cpfCnpj = { startsWith: cpfCnpj };
    }

    if (roles) {
      where.role = { in: roles };
    }

    const paginationData = FindUserDto.getPaginationParams(
      findCompanyUserDto as PaginationDto,
    );

    const total = await this.prismaService.user.count({ where });

    const users = await this.prismaService.user.findMany({
      where,
      skip: paginationData.skip,
      take: paginationData.limit,
    });

    return {
      page: paginationData.page,
      limit: paginationData.limit,
      total,
      data: users.map((c: any) => new UserEntity(c)) || [],
    };
  }

  async create(
    companyId: string,
    createCompanyUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    const company = await this.prismaService.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new HttpException('Empresa inválida', HttpStatus.BAD_REQUEST);
    }

    const existing = await this.prismaService.user.findFirst({
      where: { email: createCompanyUserDto.email, companyId: company.id },
    });

    if (!!existing) {
      throw new HttpException(
        'O email já se encontra em uso.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          ...createCompanyUserDto,
          companyId,
          slug: Slug(createCompanyUserDto.name),
        },
      });

      return user;
    });

    return new UserEntity(user);
  }

  async update(
    user: User,
    updateCompanyUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { id, email, name } = updateCompanyUserDto;
    const updateData: any = { ...updateCompanyUserDto };

    let userRow = await this.prismaService.user.findUnique({ where: { id } });
    if (!userRow) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    if (userRow.companyId !== userRow.companyId) {
      throw new HttpException(
        'O usuário não pertence a empresa informada.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userRow.role === RoleType.OWNER && userRow.id !== user.id) {
      throw new HttpException(
        'Somente um superusuário pode editar um superusuário.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (name) {
      updateData.slug = Slug(name);
    }

    if (email) {
      const existingEmail = await this.prismaService.user.count({
        where: { id: { not: id }, email, companyId: user.companyId },
      });

      if (!!existingEmail) {
        throw new HttpException(
          'O email já se encontra em uso.',
          HttpStatus.BAD_REQUEST,
        );
      }

      updateData.email = email;
    }

    userRow = await this.prismaService.user.update({
      where: { id },
      data: updateData,
    });

    return new UserEntity(userRow);
  }

  async delete(companyId: string, userId: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    if (user.companyId !== companyId) {
      throw new HttpException(
        'O usuário não pertence a empresa informada.',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
