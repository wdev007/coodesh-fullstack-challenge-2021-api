import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, from, concatAll, finalize } from 'rxjs';
import { Model } from 'mongoose';
import cheerio from 'cheerio';

import { Product } from '../schemas/product.schema';
import { IProduct } from '../interfaces/product.interface';

@Injectable()
export class ScrapingRepository {
  private readonly mapFields = {
    field_quantity_value: 'quantity',
    field_categories_value: 'categories',
    field_packaging_value: 'packaging',
    field_brands_value: 'brands',
  };
  private readonly logger = new Logger(ScrapingRepository.name);
  private products = [];

  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  save() {
    this.findAllProducts().subscribe(async (products) => {
      for (const product of products) {
        const foundProduct = await this.productModel.findOne({
          code: product.code,
        });

        if (!foundProduct) {
          await this.productModel.create(product);

          continue;
        }

        const difference = this.compareProducts(foundProduct, product);

        if (!difference) {
          continue;
        }

        await this.productModel.updateOne(
          {
            code: product.code,
          },
          difference,
        );
      }
    });
  }

  getHomePage() {
    return this.httpService.get('/');
  }

  findProduct(resource: string) {
    return this.httpService.get(resource);
  }

  findAllProducts() {
    return new Observable<IProduct[]>((subscribe) => {
      const subscribers = [];
      const baseUrl = this.configService.get('BASE_URL_PAGE_PRODUCTS');
      const baseUrlStatic = this.configService.get('BASE_URL_STATIC');
      const limitOfProducts = this.configService.get('imports.products.limit');

      this.logger.log(
        `limite de produtos a serem importados: ${limitOfProducts}`,
      );

      this.getHomePage().subscribe(({ data }) => {
        const home = cheerio.load(data);
        const listOfProductsLinks = home('ul.products li a')
          .toArray()
          .slice(0, limitOfProducts);

        this.logger.log(`QTD de produtos: ${listOfProductsLinks.length}`);

        for (const productLink of listOfProductsLinks) {
          if (!productLink.attribs.href) {
            continue;
          }

          const findProduct = this.findProduct(productLink.attribs.href);
          subscribers.push(findProduct);
        }

        from(subscribers)
          .pipe(
            concatAll(),
            finalize(() => {
              subscribe.next(this.products);
              subscribe.complete();
              this.products = [];
            }),
          )
          .subscribe(({ data }) => {
            const pageProdutc = cheerio.load(data);
            const product_name = pageProdutc('h1').text();
            const barcode = pageProdutc('#barcode_paragraph')
              .text()
              .replace('Barcode:', '')
              .replace('\n', '')
              .trim();
            const code = Number(barcode.split(' ')[0]);
            const imageSrc = pageProdutc('img#og_image').attr()?.src;
            const image_url = `${baseUrlStatic}${imageSrc}`;
            const url = `${baseUrl}/${code}`;

            const productDetails = pageProdutc(
              '.medium-12.large-8.xlarge-8.xxlarge-8.columns p',
            )
              .toArray()
              .slice(1, -1);

            const productObj: IProduct = {
              barcode,
              code,
              url,
              product_name,
              image_url,
              status: 'importing',
              imported_t: new Date().toLocaleString('pt-BR'),
            } as IProduct;

            for (const product of productDetails) {
              const $ = cheerio.load(product, {}, true);
              const attrs = $('.field_value').attr();
              const value = $('.field_value').text();

              if (!attrs?.id) {
                continue;
              }
              const key = this.mapFields[attrs?.id];

              if (!key) {
                continue;
              }

              productObj[key] = value;
            }

            this.products.push(productObj as IProduct);
          });
      });
    });
  }

  compareProducts(oldProduct: IProduct, newPrduct: IProduct) {
    let difference = {};
    const model: IProduct = {
      barcode: '',
      brands: '',
      categories: '',
      code: 0,
      image_url: '',
      packaging: '',
      product_name: '',
      quantity: '',
      status: '',
      url: '',
    } as IProduct;

    for (const prop in model) {
      if (newPrduct[prop] !== oldProduct[prop]) {
        difference = Object.assign(difference, { [prop]: newPrduct[prop] });
      }
    }

    return Object.keys(difference).length ? difference : null;
  }
}
