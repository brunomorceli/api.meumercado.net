import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import {
  ConfirmDto,
  ConfirmResponseDto,
  SigninDto,
  SigninResponseDto,
  SignupDto,
} from './dtos';
import { Public } from '@App/admins/auth/jwt-auth.guard';

import {
  Client,
  CreateSubscriptionRequest,
  CustomersController,
  PlansController,
  SubscriptionsController,
} from '@pagarme/pagarme-nodejs-sdk';
import axios from 'axios';

@ApiTags('admins/auth')
@Controller('admins/auth')
export class AuthController {
  private pagarmeClient: Client;
  constructor(private readonly authService: AuthService) {
    const secretKey = process.env.PAGARME_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "Error: environment variable: 'PAGARME_SECRET_KEY' is missing.",
      );
    }

    this.pagarmeClient = new Client({
      timeout: 0,
      basicAuthUserName: secretKey,
    });
  }

  @Post('signin')
  @Public()
  signin(@Body() signinDto: SigninDto): Promise<SigninResponseDto> {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  @Public()
  signup(@Body() signinDto: SignupDto): Promise<void> {
    return this.authService.signup(signinDto);
  }

  @Post('confirm/')
  @Public()
  confirm(@Body() confirmDto: ConfirmDto): Promise<ConfirmResponseDto> {
    return this.authService.confirm(confirmDto);
  }

  // ===========================================================
  // PLANS
  // ===========================================================

  @Post('plans')
  @Public()
  async addPlan(@Body() body: any): Promise<any> {
    const name = body.name;
    const description = body.description;
    const statementDescriptor = body.statementDescriptor;
    const price = body.price;

    const data = {
      name,
      description,
      statementDescriptor,
      price,
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
    };

    const plansController = new PlansController(this.pagarmeClient);
    try {
      const res = await plansController.createPlan(data);
      return res.result;
    } catch (e) {
      throw new HttpException(
        'Error on try to create plan.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('plans/:id')
  @Public()
  async getPlan(@Param() param: any): Promise<any> {
    const plansController = new PlansController(this.pagarmeClient);
    try {
      const res = await plansController.getPlan(param.id);
      return res.result as any;
    } catch (e) {
      throw new HttpException(
        'Error on try to get plan.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('plans')
  @Public()
  async getPlans(): Promise<any> {
    const plansController = new PlansController(this.pagarmeClient);
    try {
      const res = await plansController.getPlans();
      return res.result.data;
    } catch (e) {
      throw new HttpException(
        'Error on try to get plans.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ===========================================================
  // CUSTOMERS
  // ===========================================================

  @Post('customers')
  @Public()
  async createCustomer(): Promise<any> {
    // serve como upsert
    const data = {
      name: 'Jhon Doe',
      email: 'jhon_doe@gmail.com',
      document: '00245290109',
      type: 'individual', // individual, company, passport
      gender: 'male',
      code: 'ID_DO_MEU_MERCADO',
      address: {
        street: 'Travessa dos Alfaiates',
        neighborhood: 'Arnaldo Estevão de Figueiredo',
        number: '2345',
        country: 'BR',
        state: 'MS',
        city: 'Campo Grande',
        zipCode: '79043100',
        complement: '',
        line1: '',
        line2: '',
      },
      phones: {},
      metadata: {},
    };

    const customerController = new CustomersController(this.pagarmeClient);
    try {
      const res = await customerController.createCustomer(data);
      return res.result;
    } catch (e) {
      throw new HttpException(
        'Error on try to create customer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('customers/:id')
  @Public()
  async getCustomer(@Param() param: any): Promise<any> {
    const customerController = new CustomersController(this.pagarmeClient);
    try {
      const res = await customerController.getCustomer(param.id);
      return res.result as any;
    } catch (e) {
      throw new HttpException(
        'Error on try to get customer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ===========================================================
  // CARDS
  // ===========================================================

  @Post('customers/:customerId/cards')
  @Public()
  async createCard(@Param() param): Promise<any> {
    const data = {
      number: '4701322211111234',
      holderName: 'Jhon Doe',
      expMonth: 12,
      expYear: 26,
      cvv: '351',
      billingAddress: {
        street: 'Travessa dos Alfaiates',
        neighborhood: 'Arnaldo Estevão de Figueiredo',
        number: '2345',
        country: 'BR',
        state: 'MS',
        city: 'Campo Grande',
        zipCode: '79043100',
        complement: '',
        line1: '',
        line2: '',
      },
      brand: 'visa',
      type: 'credit',
      holderDocument: '00245290109',
      metadata: {},
    };

    const customerController = new CustomersController(this.pagarmeClient);
    try {
      const res = await customerController.createCard(param.customerId, data);
      return res.result;
    } catch (e) {
      throw new HttpException(
        'Error on try to add credit card.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('customers/:customerId/cards')
  @Public()
  async getCards(@Param() param: any): Promise<any> {
    const customerController = new CustomersController(this.pagarmeClient);
    try {
      const res = await customerController.getCards(param.customerId);
      return res.result.data as any;
    } catch (e) {
      throw new HttpException(
        'Error on try to get card list.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('customers/:customerId/cards/:cardId')
  @Public()
  async getCard(@Param() param: any): Promise<any> {
    const customerController = new CustomersController(this.pagarmeClient);
    try {
      const res = await customerController.getCard(
        param.customerId,
        param.cardId,
      );
      return res.result as any;
    } catch (e) {
      throw new HttpException(
        'Error on try to get card.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ===========================================================
  // SUBSCRIPTIONS
  // ===========================================================

  @Post('customers/:customerId/subscriptions')
  @Public()
  async createSubscription(@Param() param): Promise<any> {
    const customerController = new CustomersController(this.pagarmeClient);
    const planController = new PlansController(this.pagarmeClient);

    const customer = (await customerController.getCustomer(param.customerId))
      .result;
    const plans = await planController.getPlans();
    const plan = plans.result.data[0];
    const cards = await customerController.getCards(param.customerId);
    const card = cards.result.data[0];

    const url = 'https://api.pagar.me/core/v5/subscriptions';
    const secretKeyBase64 = Buffer.from(
      `${process.env.PAGARME_SECRET_KEY}:`,
    ).toString('base64');

    try {
      const res = await axios.request({
        url,
        method: 'post',
        headers: {
          Authorization: `Basic ${secretKeyBase64}`,
          'Content-Type': 'application/json',
        },
        data: {
          code: 'CODIGO_MEU_MERCADO_QUALQUER',
          plan_id: plan.id,
          customer_id: customer.id,
          payment_method: 'credit_card',
          card_id: card.id,
        },
      });

      return res.data;
    } catch (e) {
      throw new HttpException(
        'Error on try to create custom subscription.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('customers/:customerId/subscriptions')
  @Public()
  async getSubscriptions(@Param() param: any): Promise<any> {
    const url = `https://api.pagar.me/core/v5/subscriptions?customer_id=${param.customerId}`;
    const secretKeyBase64 = Buffer.from(
      `${process.env.PAGARME_SECRET_KEY}:`,
    ).toString('base64');

    try {
      const res = await axios.request({
        method: 'get',
        url,
        headers: {
          Authorization: `Basic ${secretKeyBase64}`,
          'Content-Type': 'application/json',
        },
      });
      return res.data.data;
    } catch (e) {
      throw new HttpException(
        'Error on try to get customer subscriptions.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('customers/:customerId/subscriptions/:subscriptionId')
  @Public()
  async getSubscription(@Param() param: any): Promise<any> {
    const subscriptionController = new SubscriptionsController(
      this.pagarmeClient,
    );
    try {
      const res = await subscriptionController.getSubscription(
        param.subscriptionId,
      );
      return res.result;
    } catch (e) {
      throw new HttpException(
        'Error on try to get customer subscription.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('customers/:customerId/subscriptions/:subscriptionId')
  @Public()
  async cancelSubscription(@Param() param: any): Promise<any> {
    const subscriptionController = new SubscriptionsController(
      this.pagarmeClient,
    );
    try {
      const res = await subscriptionController.cancelSubscription(
        param.subscriptionId,
      );
      return res.result;
    } catch (e) {
      throw new HttpException(
        'Error on try to cancel customer subscription.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
