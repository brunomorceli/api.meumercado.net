import { StringDecorator } from '@App/shared';
import { RoleType } from '@prisma/client';

export class ConfirmResponseDto {
  @StringDecorator({ description: 'Access token.' })
  token: string;
  userName: string;
  role: RoleType;
  companyId: string;
  tenantId: string;
  companyName: string;
  logo?: string;
}
