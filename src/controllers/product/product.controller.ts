import { Controller, Get, HttpCode, HttpStatus, Post, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../services/security/security-guards";
import { HttpResponse } from "../../httpResponse";
import { ProductService } from "../../services/product/product.service";

@Controller('product')
export class ProductController {

  constructor(private productService: ProductService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: any): Promise<HttpResponse> {
    return this.productService.createProduct(req.body);
  }

  @Get('get')
  @HttpCode(HttpStatus.OK)
  async get(@Query() query: any): Promise<HttpResponse> {
    return this.productService.getProduct(query.category);
  }

  @Post('add-to-cart')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async addToCard(@Request() req: any): Promise<HttpResponse> {
    return this.productService.addToCard(req.user, req.body);
  }

  @Post('delete-from-card')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async deleteFromCard(@Request() req: any): Promise<HttpResponse> {
    return this.productService.deleteFromCart(req.user, req.body.id, req.body.count);
  }
}
