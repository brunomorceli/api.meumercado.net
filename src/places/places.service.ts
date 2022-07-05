import { PrismaService } from '@App/prisma';
import { GeneralUtils } from '@App/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Place,
  PlaceStatusType,
  InviteStatusType,
  Invitation,
} from '@prisma/client';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { MessagesService } from '@App/messages';
import { InvitationResponse } from '@App/users';

@Injectable()
export class PlacesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messagesService: MessagesService,
  ) {}

  async create(
    ownerId: string,
    createPlaceDto: CreatePlaceDto,
  ): Promise<Place> {
    const search = GeneralUtils.toSearchText(createPlaceDto.label);
    const place = await this.prismaService.place.findFirst({
      where: { search, status: { not: 'DELETED' } },
    });
    if (place) {
      throw new HttpException(
        'Place name already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prismaService.place.create({
      data: {
        ...createPlaceDto,
        search,
        ownerId,
      },
    });
  }

  async findAll(ownerId: string): Promise<Array<Place>> {
    return this.prismaService.place.findMany({
      where: { ownerId, status: 'ACTIVE' },
    });
  }

  async findOne(id: string): Promise<Place> {
    return this.prismaService.place.findFirst({
      where: { id, status: 'ACTIVE' },
      include: { strategies: true },
    });
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const data: any = { ...updatePlaceDto };
    if (updatePlaceDto.label) {
      data.search = GeneralUtils.toSearchText(updatePlaceDto.label);
    }

    return this.prismaService.place.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.place.update({
      where: { id },
      data: { status: PlaceStatusType.DELETED },
    });
  }

  async invite(ownerId, inviteUserDto: InviteUserDto): Promise<void> {
    const { email } = inviteUserDto;

    const invitationData = { ...inviteUserDto, ownerId };

    const invitation = await this.prismaService.invitation.upsert({
      where: { email },
      create: invitationData,
      update: invitationData,
    });

    await this.messagesService.sendEmail({
      email,
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

  async findAllInvitations(ownerId: string): Promise<Array<Invitation>> {
    return await this.prismaService.invitation.findMany({ where: { ownerId } });
  }

  async declineInvitation(id: string): Promise<void> {
    await this.prismaService.invitation.update({
      where: { id },
      data: { status: InviteStatusType.DECLINED },
    });
  }

  async removeInvitation(id: string): Promise<void> {
    await this.prismaService.invitation.update({
      where: { id },
      data: { status: InviteStatusType.DELETED },
    });
  }

  async acceptInvitation(id: string): Promise<InvitationResponse> {
    const invitation = await this.prismaService.invitation.findFirst({
      where: { id },
    });

    if (!invitation) {
      throw new HttpException('Invalid request', HttpStatus.FORBIDDEN);
    }

    const { email, ownerId } = invitation;

    const tokenData = await this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.user.upsert({
        where: { email },
        create: { email, ownerId },
        update: { email, ownerId },
      });

      const tokenData = GeneralUtils.generateJwt({ userId: user.id });
      await prisma.user.update({
        where: { id: user.id },
        data: {
          validateAt: tokenData.createdAt,
          sessionToken: tokenData.token,
        },
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
