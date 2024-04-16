import { Injectable } from '@nestjs/common';

import {
  CardDto,
  CreateSubscriptionDto,
  PlanDto,
  SubscriptionDto,
  UpsertCardDto,
  UpsertCustomerDto,
} from './dtos';
import axios from 'axios';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { CustomerDto } from './dtos/customer.dto';
import { EPagarmeSubscriptionStatus } from './enums';

interface PagarmeServiceRequest {
  path?: string;
  payload?: any;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
}

@Injectable()
export class PagarmeService {
  private secretKey;
  private baseURL;

  constructor() {
    this.secretKey = process.env.PAGARME_SECRET_KEY;
    this.baseURL = 'https://api.pagar.me/core/v5';

    if (!this.secretKey) {
      throw new Error(
        "Error: environment variable: 'PAGARME_SECRET_KEY' is missing.",
      );
    }
  }

  private async request(args: PagarmeServiceRequest) {
    return axios({
      method: args.method || 'GET',
      url: `${this.baseURL}${Boolean(args.path) ? '/' : ''}${args.path || ''}`,
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.secretKey}:`).toString(
          'base64',
        )}`,
        'Content-Type': 'application/json',
      },
      data: args.payload || {},
    });
  }

  // ===================================================================================================
  // PLANS
  // ===================================================================================================

  public async createPlan(data: CreatePlanDto): Promise<PlanDto> {
    try {
      const response = await this.request({
        path: 'plans',
        method: 'POST',
        payload: CreatePlanDto.toJson(data),
      });

      return response.data;
    } catch (e) {
      throw new Error('Error on try to get plans');
    }
  }

  public async getPlan(id: string): Promise<PlanDto> {
    try {
      const response = await this.request({ path: `plans/${id}` });
      return Boolean(response.data) ? PlanDto.fromJson(response.data) : null;
    } catch (e) {
      throw new Error('Error on try to get plan');
    }
  }

  public async getPlans(): Promise<PlanDto[]> {
    try {
      const response = await this.request({ path: 'plans' });
      return response.data.data.map((plan) => PlanDto.fromJson(plan)) || [];
    } catch (e) {
      throw new Error('Error on try to get plans');
    }
  }

  public async deletePlan(id: string): Promise<void> {
    try {
      await this.request({
        path: `plans/${id}`,
        method: 'DELETE',
      });
    } catch (e) {
      throw new Error('Error on try to delete plan');
    }
  }

  // ===================================================================================================
  // CUSTOMERS
  // ===================================================================================================

  public async upsertCustomer(data: UpsertCustomerDto): Promise<CustomerDto> {
    try {
      const response = await this.request({
        path: 'customers',
        method: 'POST',
        payload: UpsertCustomerDto.toJson(data),
      });

      return CustomerDto.fromJson(response.data);
    } catch (e) {
      throw new Error('Error on try to save client');
    }
  }

  public async getCustomer(id: string): Promise<CustomerDto> {
    try {
      const response = await this.request({ path: `customers/${id}` });
      if (!response.data) {
        return null;
      }

      return CustomerDto.fromJson(response.data);
    } catch (e) {
      throw new Error('Error on try to get customer');
    }
  }

  // ===================================================================================================
  // CARDS
  // ===================================================================================================

  public async upsertCard(
    customerId: string,
    data: UpsertCardDto,
  ): Promise<CardDto> {
    try {
      const response = await this.request({
        path: `customers/${customerId}/cards`,
        method: 'POST',
        payload: UpsertCardDto.toJson(customerId, data),
      });

      return CardDto.fromJson(response.data);
    } catch (e) {
      throw new Error('Error on try to save card');
    }
  }

  public async getCard(customerId: string, id: string): Promise<CardDto> {
    try {
      const response = await this.request({
        path: `customers/${customerId}/cards/${id}`,
      });

      return response.data.status == 'deleted'
        ? null
        : CardDto.fromJson(response.data);
    } catch (e) {
      throw new Error('Error on try to get card');
    }
  }

  public async getCards(customerId: string): Promise<CardDto[]> {
    try {
      const response = await this.request({
        path: `customers/${customerId}/cards`,
      });

      if (!response.data) {
        return null;
      }

      return (
        response.data.data
          .filter((card) => card.status !== 'deleted')
          .map((card) => CardDto.fromJson(card)) || []
      );
    } catch (e) {
      throw new Error('Error on try to list cards');
    }
  }

  public async deleteCard(customerId: string, id: string): Promise<void> {
    try {
      await this.request({
        method: 'DELETE',
        path: `customers/${customerId}/cards/${id}`,
      });
    } catch (e) {
      throw new Error('Error on try to remove card');
    }
  }

  // ===================================================================================================
  // SUBSCRIPTIONS
  // ===================================================================================================

  public async createSubscription(
    customerId: string,
    data: CreateSubscriptionDto,
  ): Promise<SubscriptionDto> {
    try {
      const response = await this.request({
        path: 'subscriptions',
        method: 'POST',
        payload: CreateSubscriptionDto.toJson(customerId, data),
      });

      return SubscriptionDto.fromJson(response.data);
    } catch (e) {
      throw new Error('Error on try to create subscription');
    }
  }

  public async getSubscription(id: string): Promise<SubscriptionDto> {
    try {
      const response = await this.request({ path: `subscriptions/${id}` });

      return SubscriptionDto.fromJson(response.data);
    } catch (e) {
      throw new Error('Error on try to get subscription');
    }
  }

  public async getSubscriptions(
    customerId: string,
    status?: EPagarmeSubscriptionStatus.ACTIVE,
  ): Promise<SubscriptionDto> {
    let path = `subscriptions?customer_id=${customerId}`;

    if (Boolean(status)) {
      path += `&status=${status}`;
    }

    try {
      const response = await this.request({ path });

      return (
        response.data.data.map((subscription) =>
          SubscriptionDto.fromJson(subscription),
        ) || []
      );
    } catch (e) {
      throw new Error('Error on try to get subscriptions');
    }
  }

  public async cancelSubscription(id: string): Promise<void> {
    try {
      await this.request({
        method: 'DELETE',
        path: `subscriptions/${id}`,
      });
    } catch (e) {
      throw new Error('Error on try to cancel subscription');
    }
  }
}
