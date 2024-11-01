import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/utils/constants';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) { }

  async createCustomer(email: string, paymentMethodId: string) {
    return await this.stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  }
}
