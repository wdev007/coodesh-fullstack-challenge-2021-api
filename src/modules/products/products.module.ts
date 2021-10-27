import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Crawler } from './tasks/crawler/crawler';
import { ScrapingRepository } from './repositories/scraping.repository';
import { ProductSchema } from './schemas/product.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Product', schema: ProductSchema }],
      'mongo',
    ),
    HttpModule.register({
      baseURL: 'https://world.openfoodfacts.org',
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, Crawler, ScrapingRepository],
})
export class ProductsModule {}
