import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from "mongoose";

export interface UserPayload {
  sub: string; // User ID
  name: string;
}


export type UserDocument = User & Document;

@Schema()
export class User {
  _id: any;
  @Prop({ index: { unique: true } })
  login: string;
  @Prop()
  passwordHash: string;
  @Prop()
  createdAt: Date;
  @Prop({ index: { unique: true } })
  email: string;
  @Prop({ type: [Object] })
  cart: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);