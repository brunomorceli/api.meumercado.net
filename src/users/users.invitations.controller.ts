import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlacesService } from '@App/places/places.service';
import { InvitationId } from '@App/commons';
import { InviteUserDto } from '@App/places/dto/invite-user.dto';
import { InvitationResponse } from './dto';
import { Invitation } from '@prisma/client';

@ApiTags('invitations')
@Controller('users/invitations')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class UsersInvitationController {
  constructor(
    @Inject(forwardRef(() => PlacesService))
    private readonly placesService: PlacesService,
  ) {}

  @Post()
  sendInvitation(@Body() inviteUserDto: InviteUserDto) {
    return this.placesService.invite(inviteUserDto);
  }

  @Put(':invitationId/decline')
  decline(@Param() params: InvitationId): Promise<void> {
    return this.placesService.declineInvitation(params.invitationId);
  }

  @Put(':invitationId/accept')
  accept(@Param() params: InvitationId): Promise<InvitationResponse> {
    return this.placesService.acceptInvitation(params.invitationId);
  }

  @Delete(':invitationId')
  removeUser(@Param() params: InvitationId): Promise<void> {
    return this.placesService.removeUser(params.invitationId);
  }

  @Get(':invitationId')
  get(@Param() params: InvitationId): Promise<Invitation> {
    return this.placesService.getInvitation(params.invitationId);
  }
}
