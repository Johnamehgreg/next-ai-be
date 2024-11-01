import {
  Body,
  Controller,
  Get, Inject,
  Post
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { STRIPE_CLIENT } from 'src/utils/constants';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) { }

  @Get('/')
  listCustomer() {
    return this.stripe.customers.list();
  }
  @Post('create-customer')
  async createCustomer(
    @Body('email') email: string,
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    return await this.stripeService.createCustomer(email, paymentMethodId);
  }
}
