import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  code: number;

  @Prop()
  barcode: string;

  @Prop()
  status: string;

  @Prop()
  imported_t: string;

  @Prop()
  url: string;

  @Prop()
  product_name: string;

  @Prop()
  quantity: string;

  @Prop()
  categories: string;

  @Prop()
  packaging: string;

  @Prop()
  brands: string;

  @Prop()
  image_url: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
