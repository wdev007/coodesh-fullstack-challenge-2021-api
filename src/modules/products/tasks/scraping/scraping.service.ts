import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(private readonly configService: ConfigService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.logger.log('TA RODANDO A CADA 10 SEG');
  }
}
