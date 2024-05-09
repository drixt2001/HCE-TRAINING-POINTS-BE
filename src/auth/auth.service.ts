import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { map, switchMap } from "rxjs";
import { AccountService } from "../api/account/account.service";
import { UserService } from "./user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private accountService: AccountService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, role: user.role_code };
    await this.accountService.updateLastLogin(user.id).pipe();
    const access_token = await this.jwtService.signAsync(payload);
    return {
      status: "success",
      message: "Đăng nhập thành công",
      access_token: access_token,
    };
  }
}
