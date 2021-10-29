import { Test, TestingModule } from '@nestjs/testing';
import { ProductServiceMock } from './mocks/product.service.mock';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useClass: ProductServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be able create a product', async () => {
      const response = await controller.create({
        image_url:
          'https://static.openfoodfacts.org/images/products/544/900/013/1805/front_en.462.200.jpg',
        brands: 'Coca-Cola',
        packaging: 'Aluminium-can',
        categories:
          'Beverages, Carbonated drinks, Sodas, Bebida de cola light, Bebidas, Bebidas carbonatadas, Bebidas de cola, Bebidas endulzadas artificialmente, Bebidas light, Bebidas no alcohólicas, Sodas light',
        quantity: '330ml',
        product_name: 'Coca-Cola Zero - 330ml',
        url: 'https://world.openfoodfacts.org/5449000131805',
        imported_t: '10/29/2021, 12:05:17 AM',
        status: 'imported',
        barcode: '5449000131805 (EAN / EAN-13)',
        code: 5449000131805,
      });

      expect(response._id).toEqual('617b3abd72eacc15ed1c1df8');
    });
  });

  describe('findAll', () => {
    it('should be able return a array of products', async () => {
      const response = await controller.findAll({ limit: 3 });

      expect(response.data.length).toEqual(3);
    });
  });

  describe('findOne', () => {
    it('should be able a product', async () => {
      const response = await controller.findOne('5449000131805');

      expect(response.code).toEqual(5449000131805);
    });
  });
});
