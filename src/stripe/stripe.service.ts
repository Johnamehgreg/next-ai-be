import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/User.schema';
import { STRIPE_CLIENT } from 'src/utils/constants';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
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
  async createCustomer(email: string) {
    return await this.stripe.customers.create({
      email,
    });
  }

  async getCustomerBillingPortal(userId: string) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    if (!findUser.subscription.customer_id)
      throw new BadRequestException('User does not have subscription');
    const portalSessions = await this.stripe.billingPortal.sessions.create({
      customer: findUser.subscription.customer_id,
      return_url: this.configService.get<string>('WEB_SITE_URL'),
    });
    return {
      url: portalSessions.url,
    };
  }

  async createSubscription({
    planId,
    userId,
  }: {
    planId: string;
    userId: string;
  }) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    if (!planId) throw new BadRequestException('Subscription plan not found');
    const product = await this.stripe.products.retrieve(planId);
    if (!product) throw new BadRequestException('Subscription plan not found');
    const customerId = findUser?.subscription?.customer_id;
    if (!customerId) {
      const generatedCustomerId = await this.createCustomer(findUser.email);
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $set: { 'subscription.customer_id': generatedCustomerId.id },
        },
        {
          new: true,
          upsert: true,
        },
      );

      const session = this.createSession({
        customerId: updatedUser.subscription.customer_id,
        priceId: product.default_price as string,
      });

      return {
        url: (await session).url,
      };
    }
    const session = this.createSession({
      customerId,
      priceId: product.default_price as string,
    });

    return {
      url: (await session).url,
    };
  }

  async createSession({
    customerId,
    priceId,
  }: {
    customerId: string;
    priceId: string;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId as string,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get<string>('WEB_SITE_URL')}/stripe/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>('WEB_SITE_URL')}/stripe/cancel`,
    });

    return session;
  }

  async getSuccessUrl(sessionId: string) {
    const sessions = await this.stripe.checkout.sessions.retrieve(sessionId);
    console.log(sessions);
    return {
      message: 'Subscribed successfully',
    };
  }
}
