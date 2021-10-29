import { IProduct } from '../interfaces/product.interface';

export class ProductServiceMock {
  private readonly products = [
    {
      _id: '617b3abd72eacc15ed1c1df6',
      image_url:
        'https://static.openfoodfacts.org/images/products/327/408/000/5003/front_en.776.200.jpg',
      brands: 'Cristaline',
      packaging: 'Bouteille plastique, Bouchon plastique',
      categories:
        'Beverages, Waters, Spring waters, Mineral waters, Natural mineral waters',
      quantity: '1,5 l',
      product_name: 'Eau de source - Cristaline - 1,5 l',
      url: 'https://world.openfoodfacts.org/3274080005003',
      imported_t: '10/29/2021, 12:05:09 AM',
      status: 'imported',
      barcode: '3274080005003 (EAN / EAN-13)',
      code: 3274080005003,
      __v: 0,
    },
    {
      _id: '617b3abd72eacc15ed1c1df9',
      image_url:
        'https://static.openfoodfacts.org/images/products/301/762/042/2003/front_en.327.200.jpg',
      brands: 'Ferrero Nutella',
      packaging: 'Verre',
      categories:
        'Spreads, Breakfasts, Sweet spreads, fr:Pâtes à tartiner, Hazelnut spreads, Chocolate spreads, Cocoa and hazelnuts spreads, Spreads  Breakfasts  Sweet spreads  Pâtes à tartiner  Hazelnut spreads  Chocolate spreads  Cocoa and hazelnuts spreads',
      quantity: '400 g',
      product_name: 'Nutella - Ferrero Nutella - 400 g',
      url: 'https://world.openfoodfacts.org/3017620422003',
      imported_t: '10/29/2021, 12:05:11 AM',
      status: 'imported',
      barcode: '3017620422003 (EAN / EAN-13)',
      code: 3017620422003,
      __v: 0,
    },
    {
      _id: '617b3abe72eacc15ed1c1e02',
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
      __v: 0,
    },
  ];

  create(body: IProduct) {
    return Promise.resolve({
      ...body,
      _id: '617b3abd72eacc15ed1c1df8',
    });
  }

  findAll() {
    return Promise.resolve({
      data: this.products,
      total: this.products.length,
    });
  }

  findOne(id: number) {
    const product = this.products.find((item) => item.code === id);

    return Promise.resolve(product);
  }
}
