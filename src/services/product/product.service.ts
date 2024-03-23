import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "../../schemas/product.schema";
import { HttpResponse } from "../../httpResponse";
import { INTERNAL_ERROR } from "../../constants";
import { User, UserDocument } from "../../schemas/user.schema";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(Product.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
  }

  async createProduct(productDto: any): Promise<HttpResponse> {
    let httpResponse: HttpResponse;
    try {
      let product: any;
      const exists = await this.productModel.find({ category: productDto.category });
      if (exists.length > 0) {
        product = await this.productModel.findOneAndUpdate({ category: productDto.category }, { onStock: exists[0]?.onStock + 1 });
      } else {
        productDto.createdAt = new Date();
        product = await this.productModel.create(productDto);
      }
      httpResponse = new HttpResponse(true, { product });
    } catch (err) {
      this.logger.error(`Error while creating product Product: ${productDto}\n${err}`);
      httpResponse = new HttpResponse(false, null, [[INTERNAL_ERROR, err.toString()]]);
    }

    return httpResponse;
  }

  async getProduct(category?: string): Promise<HttpResponse> {
    let httpResponse: HttpResponse;
    try {
      httpResponse = new HttpResponse(true, await this.productModel.find(category ? { category } : {}));
    } catch (err) {
      this.logger.error(`Error while getting product Product: ${category}\n${err}`);
      httpResponse = new HttpResponse(false, null, [[INTERNAL_ERROR, err.toString()]]);
    }
    return httpResponse;
  }

  async addToCard(userDto: User, productDto: any): Promise<HttpResponse> {
    let httpResponse: HttpResponse;
    try {
      const user = await this.userModel.findById(userDto._id);

      const existingProductIndex = user.cart.findIndex(item => item._id === productDto._id);

      if (existingProductIndex !== -1) {
        user.cart[existingProductIndex].count += productDto.count;
      } else {
        user.cart.push({ _id: productDto._id, count: productDto.count });
      }
      const updatedUser = await user.save();
      httpResponse = new HttpResponse(true, { updatedUser });
    } catch (err) {
      this.logger.error(`Error while adding product: ${productDto}\n${err}`);
      httpResponse = new HttpResponse(false, null, [[INTERNAL_ERROR, err.toString()]]);
    }

    return httpResponse;
  }

  async deleteFromCart(userDto: User, productId: string, count: number): Promise<HttpResponse> {
    let httpResponse: HttpResponse;
    try {
      const user = await this.userModel.findById(userDto._id);

      const existingProductIndex = user.cart.findIndex(item => item._id === productId);

      if (existingProductIndex !== -1) {
        user.cart[existingProductIndex].count -= count; // Уменьшаем количество товара в корзине
        if (user.cart[existingProductIndex].count <= 0) {
          user.cart.splice(existingProductIndex, 1); // Если количество стало <= 0, удаляем товар из корзины
        }
        const updatedUser = await user.save();
        httpResponse = new HttpResponse(true, { updatedUser });
      } else {
        httpResponse = new HttpResponse(false, null, [["Product not found in cart"]]);
      }
    } catch (err) {
      this.logger.error(`Error while deleting product: ${productId}\n${err}`);
      httpResponse = new HttpResponse(false, null, [[INTERNAL_ERROR, err.toString()]]);
    }

    return httpResponse;
  }


}
