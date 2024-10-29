import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/User.schema';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/Category.Schema';
import {
  SubCategory,
  SubCategorySchema,
} from 'src/categories/schemas/SubCategory.Schema';
import { Service, ServiceSchema } from './schemas/Service.Schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Service.name,
        schema: ServiceSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: SubCategory.name,
        schema: SubCategorySchema,
      },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule { }
