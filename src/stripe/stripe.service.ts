import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STRIPE_CLIENT } from 'src/utils/constants';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly configService: ConfigService,
  ) { }

  async getSubscriptionProductList() {
    const products = await this.stripe.products.list({
      limit: 3,
    });
    if (!products.data.length)
      throw new BadRequestException('No products found');
    const productDetails = await Promise.all(
      products.data
        .filter((p) => p.active)
        .map(async (product) => {
          const priceDetail = await this.stripe.prices.retrieve(
            product.default_price as string,
          );
          const actualAmount = priceDetail.unit_amount
            ? priceDetail.unit_amount / 100
            : null;
          return {
            id: product.id,
            name: product.name,
            priceDetail: {
              price: actualAmount,
              currency: priceDetail.currency,
              interval: priceDetail.recurring.interval,
              interval_count: priceDetail.recurring.interval_count,
            },
          };
        }),
    );

    return productDetails;
  }
  async createCustomer(email: string, paymentMethodId: string) {
    return await this.stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  }

  async createSubscription({
    customerId,
    planId,
  }: {
    customerId: string;
    planId: string;
  }) {
    if (!planId) throw new BadRequestException('Subscription plan not found');
    const product = await this.stripe.products.retrieve(planId);
    if (!product) throw new BadRequestException('Subscription plan not found');
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      // billing_address_collection: 'auto',
      line_items: [
        {
          price: product.default_price as string,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get<string>('WEB_SITE_URL')}/stripe/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>('WEB_SITE_URL')}/stripe/cancel`,
    });
    return {
      url: session.url,
    };
  }

  async getSuccessUrl(sessionId: string) {
    const sessions = await this.stripe.checkout.sessions.retrieve(sessionId);
    console.log(sessions);
    return {
      message: 'Subscribed successfully',
    };
  }
}
