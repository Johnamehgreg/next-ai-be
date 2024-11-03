import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { STRIPE_CLIENT } from 'src/utils/constants';
import Stripe from 'stripe';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/guards/auth.guard';

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
  async createCustomer(@Body('email') email: string) {
    return await this.stripeService.createCustomer(email);
  }

  @UseGuards(AuthGuard)
  @Post('create-subscription')
  async createSubscription(@Query('planId') planId: string, @Req() req) {
    return this.stripeService.createSubscription({
      planId,
      userId: req.userId,
    });
  }

  @Get('success')
  async getSuccess(@Query('session_id') session_id: string) {
    return this.stripeService.getSuccessUrl(session_id);
  }
  @Get('cancel')
  async getCancel(@Res() res: Response) {
    res.redirect('/');
  }

  @UseGuards(AuthGuard)
  @Get('customer-billing-portal')
  async getCustomerBillingPortal(@Req() req) {
    return this.stripeService.getCustomerBillingPortal(req.userId);
  }
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.rawBody;

    console.log(rawBody, 'raw body');
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRET_KEY'),
      );
    } catch (err) {
      throw new BadRequestException('Webhook error: ' + err.message);
    }
    switch (event.type) {
      // Event when the subscription is started
      case 'checkout.session.completed':
        console.log(event.data, 'new subscription is started');
        // Handle the checkout.session.completed event
        break;
      // Event when the payment is successful (every subscription interval)
      case 'invoice.paid':
        console.log(event.data, 'Payment paid');
        break;
      // Event when the payment is failed due to card problem or insufficient founds (every subscription interval)
      case 'invoice.payment_failed':
        console.log(event.data, 'Payment failed');
        break;
      //  Event when subscription is updated
      case 'customer.subscription.updated':
        console.log(event.data, 'Payment update');
        break;
      default:
        console.log(`Received ${event.type} event.`);
        break;
    }
    console.log(event, 'test');
  }
}
