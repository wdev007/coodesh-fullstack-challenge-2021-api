import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { IProduct } from './interfaces/product.interface';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

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
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: productModelMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be able create a product', async () => {
      const product = {} as IProduct;
      await service.create(product);

      expect(productModelMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should be able find a product', async () => {
      await service.findOne(1);

      expect(productModelMock.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should be able find a product', async () => {
      await service.findAll({ limit: 1, skip: 2 });

      expect(productModelMock.find).toHaveBeenCalledTimes(1);
    });
  });
});
