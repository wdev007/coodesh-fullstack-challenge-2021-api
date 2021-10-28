import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { IPaginationParams } from './interfaces/pagination-params';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.productModel.create(createProductDto);
  }

  async findAll(parameters: IPaginationParams) {
    const { limit, skip = 0, startId } = parameters;
    let objectToFind = {};

    if (startId) {
      objectToFind = {
        _id: {
          $gt: startId,
        },
      };
    }

    const query = this.productModel
      .find(objectToFind)
      .sort({ _id: 1 })
      .skip(+skip);

    if (limit) {
      query.limit(+limit);
    }
    const data = await query;
    const total = await this.productModel.count();

    return { data, total };
  }

  findOne(code: number) {
    return this.productModel.findOne({
      code,
    });
  }
}
