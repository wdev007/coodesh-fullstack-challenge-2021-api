import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Observable } from 'rxjs';

import { ScrapingRepository } from './scraping.repository';
import { ConfigService } from '@nestjs/config';

class HttpServiceMock {
  get() {
    return new Observable();
  }
}

describe('ScrapingRepository', () => {
  let provider: ScrapingRepository;

  const productModelMock = {
    create: jest.fn().mockResolvedValueOnce(this),
    find: jest.fn().mockImplementation(() => {
      return {
        sort: jest.fn().mockImplementation(() => {
          return {
            skip: jest.fn().mockImplementation(() => {
              return {
                limit: jest.fn(),
              };
            }),
          };
        }),
      };
    }),
    sort: jest.fn().mockResolvedValueOnce(this),
    skip: jest.fn().mockResolvedValueOnce(this),
    limit: jest.fn().mockResolvedValueOnce(this),
    count: jest.fn().mockResolvedValueOnce(this),
    findOne: jest.fn().mockResolvedValueOnce(this),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapingRepository,
        {
          provide: getModelToken('Product'),
          useValue: productModelMock,
        },
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
        ConfigService,
      ],
    }).compile();

    provider = module.get<ScrapingRepository>(ScrapingRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
