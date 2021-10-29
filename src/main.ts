import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CronJob } from 'cron';
import { AppModule } from './app.module';
import { ScrapingRepository } from './modules/products/repositories/scraping.repository';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Products')
    .setDescription('The products API')
    .setVersion('1.0')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get(ConfigService);
  const scrapingRespository = app.get(ScrapingRepository);

  const PORT = configService.get('PORT');
  const CRON_EXPRESSION = configService.get('scheduling.cron');

  logger.log(configService.get('scheduling.description'));
  logger.log(`cron expression - ${CRON_EXPRESSION}`);

  const jobCrawler = new CronJob(CRON_EXPRESSION, () => {
    scrapingRespository.save();
  });

  jobCrawler.start();

  await app.listen(PORT);

  logger.log(`application is running in PORT: ${PORT}`);
}
bootstrap();
