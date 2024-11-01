import {
  DynamicModule,
  Module,
  Provider,
  ModuleMetadata,
} from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/utils/constants';
import Stripe from 'stripe';

interface StripeModuleOptions {
  apiKey: string;
  config?: Stripe.StripeConfig;
}

interface AsyncStripeModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<StripeModuleOptions> | StripeModuleOptions;
  inject?: any[];
}

@Module({})
export class StripeModule {
  static forRootAsync(options: AsyncStripeModuleOptions): DynamicModule {
    const stripeProvider: Provider = {
      provide: STRIPE_CLIENT,
      useFactory: async (...args: any[]) => {
        const { apiKey, config } = await options.useFactory(...args);
        if (!apiKey) {
          throw new Error('Stripe API key is missing');
        }
        return new Stripe(apiKey, config || {});
      },
      inject: options.inject || [],
    };

    return {
      module: StripeModule,
      imports: options.imports || [],
      providers: [stripeProvider],
      exports: [stripeProvider],
      global: true,
    };
  }
}
