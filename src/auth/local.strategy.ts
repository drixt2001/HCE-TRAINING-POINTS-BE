import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { map, mergeMap, switchMap } from "rxjs";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException({
        message: "Sai thông tin đăng nhập",
        status: "error",
      });
    }
    return user;
  }
}
