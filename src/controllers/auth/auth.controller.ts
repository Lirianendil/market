import { Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, PwdAuthGuard } from "../../services/security/security-guards";
import { AuthService } from "../../services/auth/auth.service";
import { HttpResponse } from "../../httpResponse";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PwdAuthGuard)
  async authenticate(@Request() req: any): Promise<HttpResponse> {
    return this.authService.login(req.user);
  }

  @Post('registration')
  @HttpCode(HttpStatus.OK)
  async registration(@Request() req: any): Promise<HttpResponse> {
    return this.authService.saveUser(req.body);
  }

  // test endpoint
  @Post('load')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async loadUser(@Request() req: any): Promise<HttpResponse> {
    return new HttpResponse(true, req.user);
  }


}
