import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { CronJob } from 'cron';
import { AppModule } from './app.module';
import { ScrapingRepository } from './modules/products/repositories/scraping.repository';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService: ConfigService = app.get(ConfigService);
  const scrapingRespository = app.get(ScrapingRepository);

  const PORT = configService.get('PORT');
  const CRON_EXPRESSION = configService.get('scheduling.cron');

  logger.log(`cron expression - ${CRON_EXPRESSION}`);

  const jobCrawler = new CronJob(CRON_EXPRESSION, () => {
    scrapingRespository.save();
  });

  jobCrawler.start();

  await app.listen(PORT);

  logger.log(`application is running in PORT: ${PORT}`);
}
bootstrap();
