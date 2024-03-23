import { Injectable, Logger } from "@nestjs/common";
import { SecurityService } from "../security/security.service";
import { HttpResponse } from "../../httpResponse";
import { INTERNAL_ERROR } from "../../constants";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private securityService: SecurityService
  ) {
  }

  async login(userDto: any): Promise<HttpResponse> {
    let httpResponse: HttpResponse;
    try {
      const accessToken = await this.securityService.generateJwtToken(userDto);
      httpResponse = new HttpResponse(true, {user: userDto, accessToken});
    } catch (err) {
      this.logger.error(`Error while authenticating user. User: ${userDto}\n${err}`);
      httpResponse = new HttpResponse(false, null, [[INTERNAL_ERROR, err.toString()]]);
    }

    return httpResponse;
  }

  async saveUser(userDto: any): Promise<HttpResponse> {
    let httpResponse: HttpResponse;

    try {
      const existedUser = await this.userModel.findOne({email: userDto?.email});

      if (existedUser) {
        return new HttpResponse(false, null, ['User already exists']);
      }

      userDto.createdAt = new Date();
      userDto.passwordHash = await this.securityService.generatePasswordHash(userDto?.password);

      const accessToken = await this.securityService.generateJwtToken(userDto);
      const user = await this.userModel.create(userDto);
      user.passwordHash = null;
      httpResponse = new HttpResponse(true, {user: user, accessToken});
    } catch (err) {
      this.logger.error(`Error while registration user ${JSON.stringify(userDto)}\n${err}`);
      httpResponse = new HttpResponse(false, null, [[INTERNAL_ERROR, err.toString()]]);
    }

    return httpResponse;
  }


}
