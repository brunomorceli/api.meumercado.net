import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmDto,
  ConfirmResponseDto,
  SigninDto,
  SigninResponseDto,
  SignupDto,
  SubscriptionDto,
} from './dtos';

import {
  IdStringParamDto,
  PagarmeService,
  UpsertCustomerDto,
  CreatePlanDto,
  UpsertCardDto,
  CreateSubscriptionDto,
} from '@App/shared';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './jwt-auth.guard';

@ApiTags('admins/auth')
@Controller('admins/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly pagarmeService: PagarmeService,
  ) {}

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

  @UseGuards(AuthGuard('admins'))
  @Get('subscription')
  async getSubscription(@Req() req: any): Promise<SubscriptionDto> {
    const subscription = await this.authService.getSubscription(req.user.id);

    return Boolean(subscription) ? new SubscriptionDto(subscription) : null;
  }

  // ===========================================================
  // PLANS
  // ===========================================================

  @Post('plans')
  @Public()
  addPlan(@Body() body: CreatePlanDto): Promise<any> {
    try {
      return this.pagarmeService.createPlan(body);
    } catch (e) {
      throw new HttpException(
        'Error on try to create plan.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('plans/:id')
  @Public()
  async getPlan(@Param() params: IdStringParamDto): Promise<any> {
    return this.pagarmeService.getPlan(params.id);
  }

  @Get('plans')
  @Public()
  async getPlans(): Promise<any> {
    return this.pagarmeService.getPlans();
  }

  @Delete('plans/:id')
  @Public()
  async deletePlan(@Param() params: IdStringParamDto): Promise<any> {
    return this.pagarmeService.deletePlan(params.id);
  }

  // ===========================================================
  // CUSTOMERS
  // ===========================================================

  @Post('customers')
  @Public()
  async createCustomer(@Body() body: UpsertCustomerDto): Promise<any> {
    return this.pagarmeService.upsertCustomer(body);
  }

  @Get('customers/:id')
  @Public()
  async getCustomer(@Param() params: IdStringParamDto): Promise<any> {
    return this.pagarmeService.getCustomer(params.id);
  }

  // ===========================================================
  // CARDS
  // ===========================================================

  @Post('customers/:id/cards')
  @Public()
  async createCard(@Param() params, @Body() body: UpsertCardDto): Promise<any> {
    return this.pagarmeService.upsertCard(params.id, body);
  }

  @Get('customers/:id/cards')
  @Public()
  async getCards(@Param() params: IdStringParamDto): Promise<any> {
    return this.pagarmeService.getCards(params.id);
  }

  @Get('customers/:customerId/cards/:cardId')
  @Public()
  async getCard(@Param() params: any): Promise<any> {
    return this.pagarmeService.getCard(params.customerId, params.cardId);
  }

  @Delete('customers/:customerId/cards/:cardId')
  @Public()
  async deleteCard(@Param() params: any): Promise<any> {
    return this.pagarmeService.deleteCard(params.customerId, params.cardId);
  }

  // ===========================================================
  // SUBSCRIPTIONS
  // ===========================================================

  @Post('customers/:customerId/subscriptions')
  @Public()
  async createSubscription(
    @Param() params,
    @Body() body: CreateSubscriptionDto,
  ): Promise<any> {
    return this.pagarmeService.createSubscription(params.customerId, body);
  }

  @Get('customers/:id/subscriptions')
  @Public()
  async getCustomerSubscriptions(
    @Param() params: IdStringParamDto,
  ): Promise<any> {
    return this.pagarmeService.getSubscriptions(params.id);
  }

  @Get('customers/:customerId/subscriptions/:subscriptionId')
  @Public()
  async getCustomerSubscription(@Param() params: any): Promise<any> {
    return this.pagarmeService.getSubscription(params.subscriptionId);
  }

  @Delete('customers/:customerId/subscriptions/:subscriptionId')
  @Public()
  async cancelCustomerSubscription(@Param() params: any): Promise<any> {
    return this.pagarmeService.cancelSubscription(params.subscriptionId);
  }
}
