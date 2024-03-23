import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  _id: any;
  @Prop({ index: { unique: true } })
  category: string;
  @Prop()
  price: string;
  @Prop() // Base 64 string
  image: string;
  @Prop()
  description: string;
  @Prop()
  onStock: number;
  @Prop()
  createdAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);