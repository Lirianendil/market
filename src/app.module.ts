import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JWT_EXPIRES_IN, JWT_SECRET, MONGO_URL } from "./constants";
import { User, UserSchema } from "./schemas/user.schema";
import { AuthController } from "./controllers/auth/auth.controller";
import { AuthService } from "./services/auth/auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { SecurityService } from "./services/security/security.service";
import { JwtAuthStrategy } from "./services/security/jwt-auth-strategy";
import { PwdAuthStrategy } from "./services/security/pwd-auth-strategy";
import { ProductController } from "./controllers/product/product.controller";
import { ProductService } from "./services/product/product.service";
import { Product, ProductSchema } from "./schemas/product.schema";

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "local",
      session: false,
      property: "user"
    }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { issuer: "market-api", expiresIn: JWT_EXPIRES_IN }
    }),

    MongooseModule.forRoot(MONGO_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  controllers: [
    AuthController,
    ProductController
  ],
  providers: [
    SecurityService,
    JwtAuthStrategy,
    PwdAuthStrategy,
    AuthService,
    ProductService
  ]
})
export class AppModule {
}
