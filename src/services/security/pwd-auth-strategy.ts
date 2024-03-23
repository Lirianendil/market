import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {SecurityService} from './security.service';
import {User} from '../../schemas/user.schema';
import {Strategy} from 'passport-local';

@Injectable()
export class PwdAuthStrategy extends PassportStrategy(Strategy) {

  constructor(private securityService: SecurityService) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<User | null> {
    const user = await this.securityService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
