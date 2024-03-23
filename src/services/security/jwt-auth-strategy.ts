import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from "../../schemas/user.schema";
import { JWT_SECRET } from "../../constants";
import { SecurityService } from "./security.service";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private securityService: SecurityService) {
    super({
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<User | null> {
    const user = await this.userModel.findOne({_id: payload.sub});

    if (!user) {
      throw new UnauthorizedException();
    }
    user.passwordHash = null;

    return user;
  }


}
