import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import cheerio from 'cheerio';
import { Model } from 'mongoose';
import { finalize, Observable } from 'rxjs';
import { IProduct } from '../interfaces/product.interface';
import { Product } from '../schemas/product.schema';
// import { forkJoin } from 'rxjs';

@Injectable()
export class ScrapingRepository {
  private readonly mapFields = {
    field_quantity_value: 'quantity',
    field_categories_value: 'categories',
  };
  private readonly logger = new Logger(ScrapingRepository.name);

  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
    private readonly httpService: HttpService,
  ) {}

  save() {
    this.findAllProducts().subscribe(async (products) => {
      for (const product of products) {
        await this.productModel.create(product);
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
      const products: IProduct[] = [];
      this.getHomePage().subscribe(({ data }) => {
        const home = cheerio.load(data);
        const listOfProductsLinks = home('ul.products li a').toArray();
        this.logger.log(
          `Quantidade de produtos encontrados: ${listOfProductsLinks.length}`,
        );

        for (const productLink of listOfProductsLinks.slice(0, 5)) {
          if (!productLink.attribs.href) {
            continue;
          }

          this.findProduct(productLink.attribs.href)
            .pipe(
              finalize(() => {
                console.log('produts: ', products);
                subscribe.next(products);
                subscribe.complete();
              }),
            )
            .subscribe(({ data }) => {
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

                // console.log('barcode: ', barcode);
                // console.log('id: ', productId);
                // console.log('conteudo: ', detail);

                productObj[this.mapFields[productId]] = detail;
              }
              products.push(productObj as IProduct);
            });
        }
      });
    });
  }
}
