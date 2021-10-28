import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import cheerio from 'cheerio';
import { Model } from 'mongoose';
import { Observable, from, concatAll, finalize } from 'rxjs';
import { IProduct } from '../interfaces/product.interface';
import { Product } from '../schemas/product.schema';

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
      console.log(products[0]);
      for (const product of products) {
        const foundProduct = await this.productModel.findOne({
          code: product.code,
        });

        if (foundProduct) {
          continue;
        }

        const result = await this.productModel.create(product);
        console.log(result);
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
      this.getHomePage().subscribe(({ data }) => {
        const home = cheerio.load(data);
        const listOfProductsLinks = home('ul.products li a')
          .toArray()
          .slice(0, 100);

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

  // findAll() {
  //   return new Observable<any[]>((subscriber) => {
  //     subscriber.next(this.peoples);
  //     subscriber.complete();
  //   });
  // }

  // findOne(name: string) {
  //   return new Observable((subscriber) => {
  //     const people = this.peoples.find((item) => item.name === name);
  //     subscriber.next(people);
  //     subscriber.complete();
  //   });
  // }

  // main() {
  //   this.findAll().subscribe((response) => {
  //     const subs = [];
  //     console.log('response: ', response);
  //     for (const item of response) {
  //       const find = this.findOne(item.name);
  //       subs.push(find);
  //     }
  //     from(subs)
  //       .pipe(concatAll())
  //       .subscribe((res) => {
  //         console.log('res: ', res);
  //       });
  //   });
  // }
}

/**
 * 
 * .subscribe(({ data }) => {
            const pageProdutc = cheerio.load(data);
            // const barcode = pageProdutc('#barcode').text();

            const productDetails = pageProdutc(
              '.medium-12.large-8.xlarge-8.xxlarge-8.columns p',
            )
              .toArray()
              .slice(1, -1);

            const productObj = {};

            for (const product of productDetails) {
              const productId = product.attribs.id;
              if (!productId) {
                continue;
              }
              const $ = cheerio.load(product, {}, true);
              const detail = $('span').text();

              productObj[this.mapFields[productId]] = detail;
            }
            products.push(productObj as IProduct);
            subscribe.next(products);
          });
 */
