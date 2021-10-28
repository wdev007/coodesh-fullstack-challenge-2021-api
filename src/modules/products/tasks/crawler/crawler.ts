import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScrapingRepository } from '../../repositories/scraping.repository';

@Injectable()
export class Crawler {
  private readonly logger = new Logger(Crawler.name);

  constructor(private readonly scrapingRepository: ScrapingRepository) {}

  @Cron(CronExpression.EVERY_10_MINUTES) // '*/2 * * * *'
  handleCron() {
    this.scrapingRepository.save();
  }
}
