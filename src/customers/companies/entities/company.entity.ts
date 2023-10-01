import {
  ArrayDecorator,
  DateDecorator,
  EntityDto,
  EnumDecorator,
  ImageDecorator,
  StringDecorator,
  UuidDecorator,
} from '@App/shared';
import { Company, CompanyStatusType } from '@prisma/client';
import { CategoryDto } from '../dtos';
import { IsInstance, IsOptional } from 'class-validator';

export class CompanyEntity {
  @UuidDecorator()
  id: string;

  @IsInstance(EntityDto)
  @IsOptional()
  entity: EntityDto;

  @StringDecorator({ required: false })
  description?: string;

  @ImageDecorator({ required: false })
  logo?: string;

  @ArrayDecorator({ type: CategoryDto })
  categories: CategoryDto[];

  @EnumDecorator({ enumType: CompanyStatusType })
  status: CompanyStatusType;

  @DateDecorator({ description: 'Creating date.' })
  createdAt: string;

  @DateDecorator({ description: 'Deleting date.', required: false })
  deletedAt?: string;

  constructor(data: Company) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}
