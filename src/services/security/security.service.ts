import { Injectable, Logger } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { User, UserDocument, UserPayload } from "../../schemas/user.schema";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BCRYPT_HASH_ROUNDS, INTERNAL_ERROR } from "../../constants";
import { HttpResponse } from "../../httpResponse";

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(private jwtService: JwtService, @InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async generatePasswordHash(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_HASH_ROUNDS);
  }

  async generateJwtToken(user: User, jwtSignOptions: JwtSignOptions = null): Promise<string> {
    let jwtToken: string;

    if (user?._id) {
      const payload: UserPayload = { sub: user._id, name: user.login };
      jwtToken = await this.jwtService.signAsync(payload, jwtSignOptions);
    }

    return jwtToken;
  }

  async checkPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  async validateUser(login: string, password): Promise<User | null> {
    let result;
    const user: User = await this.userModel.findOne({ login });

    if (user && await this.checkPassword(password, user.passwordHash)) {
      user.passwordHash = null;
      result = user;
    }

    return result;
  }

  async updatePassword(userDto: User, password: string): Promise<any> {
    let httpResponse;

    try {
      const createdUser: User = await this.userModel
        .findOneAndUpdate(
          {
            _id: userDto._id,
            passwordHash: await this.generatePasswordHash(password), createdAt: new Date()
          });

      httpResponse = new HttpResponse(true, {
        user: {
          login: createdUser.login,
          personalData: { email: createdUser.email },
          createdAt: createdUser.createdAt
        },
        token: await this.generateJwtToken(createdUser)
      });
    } catch (err) {
      this.logger.error(`Error while changing  user's password ${JSON.stringify(userDto)}\n${err}`);
      httpResponse = new HttpResponse(false, null, [[INTERNAL_ERROR, err.toString()]]);
    }

    return httpResponse;
  }

}
