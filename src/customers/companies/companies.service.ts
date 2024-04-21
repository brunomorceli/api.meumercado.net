import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@App/shared';
import { CompanyEntity } from './entities';
import { CompanyPlan } from '@prisma/client';

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

  async getLastPlan(companyId: string): Promise<CompanyPlan> {
    const company = await this.prismaService.company.findFirst({
      where: { id: companyId },
      include: {
        companyPlans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!company || company.companyPlans.length === 0) {
      return null;
    }

    return company.companyPlans[0];
  }
}
