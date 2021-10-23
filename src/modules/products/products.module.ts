import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ScrapingService } from './tasks/scraping/scraping.service';
import { ScrapingRepository } from './repositories/scraping.repository';
import { ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Product', schema: ProductSchema }],
      'mongo',
    ),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ScrapingService, ScrapingRepository],
})
export class ProductsModule {}
