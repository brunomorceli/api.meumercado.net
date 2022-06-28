import { PartialType } from '@nestjs/swagger';
import { CreateUserPlaceDto } from './create-user-place.dto';

export class UpdateUserPlaceDto extends PartialType(CreateUserPlaceDto) {}
