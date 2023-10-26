import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@App/shared';
import { UpdateUserDto } from './dtos';
import { UserEntity } from './entities';
import * as Slug from 'slug';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async get(userId: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
    }

    return new UserEntity(user);
  }

  async update(
    user: User,
    updateCompanyUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { id } = user;
    const { email, name } = updateCompanyUserDto;
    const updateData: any = { ...updateCompanyUserDto };

    let userRow = await this.prismaService.user.findUnique({ where: { id } });
    if (!userRow) {
      throw new HttpException('Registro inválido', HttpStatus.BAD_REQUEST);
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
}
