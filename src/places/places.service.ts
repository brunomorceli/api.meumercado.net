import { PrismaService } from '@App/prisma';
import { GeneralUtils } from '@App/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Place,
  PlaceStatusType,
  RoleType,
  InviteStatusType,
  UserPlace,
  UserPlaceStatusType,
  Invitation,
} from '@prisma/client';
import { CreateUserPlaceDto } from './dto/create-user-place.dto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { UpdateUserPlaceDto } from './dto/update-user-place.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { MessagesService } from '@App/messages';
import { InvitationResponse } from '@App/users';

@Injectable()
export class PlacesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messagesService: MessagesService,
  ) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const search = GeneralUtils.toSearchText(createPlaceDto.label);

    const place = await this.prismaService.$transaction(async (prisma) => {
      const place = await prisma.place.create({
        data: { ...createPlaceDto, search },
      });

      await this.addUser(
        createPlaceDto.userId,
        place.id,
        {
          role: RoleType.OWNER,
          status: UserPlaceStatusType.ACTIVE,
        },
        prisma,
      );

      return place;
    });

    return place;
  }

  async addUser(
    userId: string,
    placeId: string,
    createUserPlaceDto: CreateUserPlaceDto,
    prismaHandler?: any,
  ): Promise<UserPlace> {
    return (prismaHandler || this.prismaService).userPlace.create({
      data: {
        ...createUserPlaceDto,
        placeId,
        userId,
      },
    });
  }

  async updateUser(
    userId: string,
    placeId: string,
    updateUserPlaceDto: UpdateUserPlaceDto,
    prismaHandler?: any,
  ) {
    await (prismaHandler || this.prismaService).userPlace.update({
      where: { placeId, userId },
      data: updateUserPlaceDto,
    });
  }

  async removeUser(id: string): Promise<void> {
    await this.prismaService.userPlace.update({
      where: { id },
      data: { status: UserPlaceStatusType.DELETED },
    });
  }

  async findAll(userId: string) {
    const registries = await this.prismaService.userPlace.findMany({
      where: { userId, status: 'ACTIVE' },
      select: { place: true },
    });

    return registries.map((up) => up.place);
  }

  async findOne(id: string): Promise<Place> {
    return this.prismaService.place.findFirst({
      where: { id, status: 'ACTIVE' },
    });
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const placeId = id;
    const existing = await this.prismaService.userPlace.findFirst({
      where: {
        placeId,
        status: 'ACTIVE',
        role: { in: ['ADMIN', 'OWNER'] },
      },
    });

    if (!existing) {
      throw new HttpException('Insufficient credentials', HttpStatus.FORBIDDEN);
    }

    const data: any = { ...updatePlaceDto };
    if (updatePlaceDto.label) {
      data.search = GeneralUtils.toSearchText(updatePlaceDto.label);
    }

    return this.prismaService.place.update({ where: { id: placeId }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.place.update({
      where: { id },
      data: { status: PlaceStatusType.DELETED },
    });
  }

  async invite(inviteUserDto: InviteUserDto): Promise<void> {
    const { email, phoneNumber, placeId } = inviteUserDto;
    const where: any = {};

    if (email) {
      where.email_place = { email, placeId };
    } else {
      where.phone_number_place = { phoneNumber, placeId };
    }

    const invitationData = { ...inviteUserDto, placeId };

    const invitation = await this.prismaService.invitation.upsert({
      where,
      create: invitationData,
      update: invitationData,
    });

    if (email) {
      await this.messagesService.sendEmail({
        email,
        metadata: { invitationId: invitation.id },
      });
      return;
    }

    await this.messagesService.sendSms({
      phoneNumber,
      metadata: { invitationId: invitation.id },
    });
  }

  async uninviteUser(id: string): Promise<void> {
    await this.prismaService.invitation.update({
      where: { id },
      data: { status: InviteStatusType.DELETED },
    });
  }

  async getInvitation(id: string): Promise<Invitation> {
    return await this.prismaService.invitation.findFirst({
      where: { id },
    });
  }

  async findAllInvitations(placeId: string): Promise<Array<Invitation>> {
    return await this.prismaService.invitation.findMany({
      where: { placeId },
    });
  }

  async declineInvitation(id: string): Promise<void> {
    await this.prismaService.invitation.update({
      where: { id },
      data: { status: InviteStatusType.DECLINED },
    });
  }

  async acceptInvitation(id: string): Promise<InvitationResponse> {
    const invitation = await this.prismaService.invitation.findFirst({
      where: { id },
    });

    if (!invitation) {
      throw new HttpException('Invalid request', HttpStatus.FORBIDDEN);
    }

    const { email, role, placeId } = invitation;

    const tokenData = await this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.user.upsert({
        where: { email },
        create: { email },
        update: { email },
      });

      const tokenData = GeneralUtils.generateJwt({ userId: user.id });
      await prisma.user.update({
        where: { id: user.id },
        data: {
          validateAt: tokenData.createdAt,
          validationCode: tokenData.token,
        },
      });

      const userId = user.id;
      const userPlaceData = {
        userId,
        placeId,
        role,
        status: UserPlaceStatusType.ACTIVE,
      };

      await prisma.userPlace.upsert({
        where: { userId_placeId: { userId, placeId } },
        create: userPlaceData,
        update: userPlaceData,
      });

      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InviteStatusType.ACTIVE },
      });

      return tokenData;
    });

    return { token: tokenData.token };
  }
}
