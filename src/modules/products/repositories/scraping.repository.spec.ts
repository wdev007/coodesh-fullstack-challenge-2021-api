import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingRepository } from './scraping.repository';

describe('ScrapingRepository', () => {
  let provider: ScrapingRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapingRepository],
    }).compile();

    provider = module.get<ScrapingRepository>(ScrapingRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
