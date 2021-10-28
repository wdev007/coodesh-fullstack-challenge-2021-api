import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Crawler } from './tasks/crawler/crawler';
import { ScrapingRepository } from './repositories/scraping.repository';
import { ProductSchema } from './schemas/product.schema';
import { HttpModule } from '@nestjs/axios';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature(
      [{ name: 'Product', schema: ProductSchema }],
      'mongo',
    ),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('BASE_URL_PAGE_PRODUCTS'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, Crawler, ScrapingRepository],
})
export class ProductsModule {}
