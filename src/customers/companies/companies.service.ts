import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@App/shared';
import { CompanyEntity } from './entities';

@Injectable()
export class CompaniesService {
  constructor(private readonly prismaService: PrismaService) {}

  async get(tenantId: string): Promise<CompanyEntity> {
    const company = await this.prismaService.company.findFirst({
      where: { tenantId, deletedAt: null },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return new CompanyEntity(company);
  }
}
