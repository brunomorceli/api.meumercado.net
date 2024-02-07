import { Injectable } from '@nestjs/common';

import {
  Client,
  CreatePlanRequest,
  GetPlanResponse,
  PlansController,
  UpdatePlanRequest,
  CustomersController,
} from '@pagarme/pagarme-nodejs-sdk';
import { PlanDto, UpdatePlanDto } from './dtos';

@Injectable()
export class PagarmeService {
  private client: Client;
  private plansController: PlansController;
  private customersController: CustomersController;

  constructor() {
    this.getClient();
  }

  private getClient(): Client {
    if (!this.client) {
      const secretKey = process.env.PAGARME_SECRET_KEY;
      if (!secretKey) {
        throw new Error(
          "Error: environment variable: 'PAGARME_SECRET_KEY' is missing.",
        );
      }

      this.client = new Client({ timeout: 0, basicAuthUserName: secretKey });
    }

    return this.client;
  }

  private getPlansController(): PlansController {
    if (!this.plansController) {
      this.plansController = new PlansController(this.getClient());
    }

    return this.plansController;
  }

  private getCustomersController(): CustomersController {
    if (!this.customersController) {
      this.customersController = new CustomersController(this.getClient());
    }

    return this.customersController;
  }

  public async createPlan(data: PlanDto): Promise<PlanDto> {
    const plansController = this.getPlansController();

    const planData: CreatePlanRequest = {
      paymentMethods: ['credit_card'],
      shippable: false,
      currency: 'BRL',
      interval: 'month',
      intervalCount: 1,
      trialPeriodDays: 7,
      billingType: 'prepaid',
      pricingScheme: { schemeType: 'unit', price: 4999 },
      quantity: 1,
      items: [],
      installments: [],
      billingDays: [],
      metadata: {},
      ...data,
    };

    try {
      const request = await plansController.createPlan(planData as any);
      return PlanDto.fromResponse(request.result as GetPlanResponse);
    } catch (e) {
      throw new Error(`Error on try to create plan: ${e.response}`);
    }
  }

  public async updatePlan(data: UpdatePlanDto): Promise<PlanDto> {
    this.getPlansController();

    const existingPlan = await this.getPlan(data.id);

    if (!existingPlan) {
      throw new Error('Error on try to update plan: Plan not found.');
    }

    const { id, ...planData } = data;

    const updateData: UpdatePlanRequest = {
      ...(existingPlan as any),
      ...planData,
    };

    try {
      const request = await this.plansController.updatePlan(id, updateData);
      return PlanDto.fromResponse(request.result as GetPlanResponse);
    } catch (e) {
      throw new Error(`Error on try to update plan: ${e.response}`);
    }
  }

  public async getPlans(): Promise<PlanDto[]> {
    const plansController = this.getPlansController();

    try {
      const request = await plansController.getPlans();

      return (request.result.data || []).map((p) =>
        PlanDto.fromResponse(p as GetPlanResponse),
      );
    } catch (e) {
      throw new Error(`Error on try to get plans: ${e.response}`);
    }
  }

  public async getPlan(id: string): Promise<PlanDto> {
    const plansController = this.getPlansController();

    try {
      const request = await plansController.getPlan(id);
      return request.result ? PlanDto.fromResponse(request.result) : null;
    } catch (e) {
      throw new Error(`Error on try to get plan: ${e.response}`);
    }
  }

  public async deletePlan(id: string): Promise<void> {
    const plansController = this.getPlansController();

    try {
      await plansController.deletePlan(id);
    } catch (e) {
      throw new Error(`Error on try to remove plan: ${e.response}`);
    }
  }
}
