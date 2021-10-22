import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ScrapingService } from './tasks/scraping/scraping.service';
import { ConfigModule } from '@nestjs/config';
import { ScrapingRepository } from './repositories/scraping.repository';
import configuration from 'src/shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ScrapingService, ScrapingRepository],
})
export class ProductsModule {}
