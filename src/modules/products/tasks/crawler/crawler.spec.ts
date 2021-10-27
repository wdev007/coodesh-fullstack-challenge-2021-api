import { Test, TestingModule } from '@nestjs/testing';
import { Crawler } from './crawler';

describe('Crawler', () => {
  let service: Crawler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Crawler],
    }).compile();

    service = module.get<Crawler>(Crawler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
