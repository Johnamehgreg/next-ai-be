import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoriesModule } from './categories/categories.module';
import { User, UserSchema } from './users/schemas/User.schema';
import { ServicesModule } from './services/services.module';
import { UploadModule } from './upload/upload.module';
import { StripeModule as CustomStripeModule } from './custom-module/stripe.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    // MailerModule.forRoot({
    //   transport: {
    //     host: process.env.EMAIL_HOST,
    //     port: parseInt(process.env.EMAIL_PORT),
    //     auth: {
    //       user: process.env.EMAIL_USERNAME,
    //       pass: process.env.EMAIL_PASSWORD,
    //     },
    //   },
    // }),

    CustomStripeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('stripe.apiKey'),
        config: {}, // Optional: Add any Stripe configuration here if needed
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('email.host'),
          port: parseInt(configService.get('email.port')),
          auth: {
            user: configService.get('email.user'),
            pass: configService.get('email.pass'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('EMAIL_FROM')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      load: [config],
    }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UsersModule,
    PostsModule,
    ProductsModule,
    AuthModule,
    CategoriesModule,
    ServicesModule,
    UploadModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
