import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { STRIPE_CLIENT } from 'src/utils/constants';
import Stripe from 'stripe';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly configService: ConfigService,
  ) { }

  @Get('/customer-list')
  listCustomer() {
    return this.stripe.customers.list();
  }
  @Get('subscription-product-list')
  listProductSubscription() {
    return this.stripeService.getSubscriptionProductList();
  }
  @Post('create-customer')
  async createCustomer(
    @Body('email') email: string,
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    return await this.stripeService.createCustomer(email, paymentMethodId);
  }
  @Post('create-subscription')
  async createSubscription(
    @Body('customerId') customerId: string,
    @Query('planId') planId: string,
  ) {
    return this.stripeService.createSubscription({ customerId, planId });
  }

  @Get('success')
  async getSuccess(@Query('session_id') session_id: string) {
    return this.stripeService.getSuccessUrl(session_id);
  }
  @Get('cancel')
  async getCancel(@Res() res: Response) {
    res.redirect('/');
  }
  @Get('customer-billing-portal/:customer_id')
  async getCustomerBillingPortal(
    @Param('customer_id') customer_id: string,
    @Res() res: Response,
  ) {
    const portalSessions = await this.stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: this.configService.get<string>('WEB_SITE_URL'),
    });
    res.redirect(portalSessions.url);
  }
}
