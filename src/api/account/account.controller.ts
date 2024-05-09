import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../auth/constants";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { UserService } from "../../auth/user/user.service";
import { AccountService } from "./account.service";
@Controller("account")
export class AccountController {
  constructor(
    private userService: UserService,
    private readonly jwt: JwtService,
    private accountSerice: AccountService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("info")
  getinfo(@Req() req) {
    let token = req.headers.authorization;
    token = token.replace("Bearer ", "");
    const payload = this.jwt.verify(token, {
      secret: jwtConstants.secret,
    });
    return this.accountSerice.getInfo(payload.email, payload.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getList(@Query("role_id") role_id: string, @Query("email") email: string) {
    return this.accountSerice.getList(role_id, email);
  }

  @UseGuards(JwtAuthGuard)
  @Get("allroles")
  getAllRole() {
    return this.accountSerice.getAllRoles();
  }

  @UseGuards(JwtAuthGuard)
  @Get("getOne")
  getOne(
    @Req() req,
    @Query("role_code") role_code: string,
    @Query("email") email: string,
  ) {
    let token = req.headers.authorization;
    token = token.replace("Bearer ", "");
    const payload = this.jwt.verify(token, {
      secret: jwtConstants.secret,
    });
    if (payload.role == 1) {
      return this.accountSerice.getInfo(email, role_code);
    } else throw new ForbiddenException("Không có quyền");
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: any) {
    return this.accountSerice.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(@Body() dto: any, @Param("id", ParseIntPipe) id: number) {
    return this.accountSerice.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("changepass")
  newpass(@Body() dto: any, @Req() req) {
    let token = req.headers.authorization;
    token = token.replace("Bearer ", "");
    const payload = this.jwt.verify(token, {
      secret: jwtConstants.secret,
    });
    return this.accountSerice.changepass(
      payload.email,
      dto.email,
      dto.oldpass,
      dto.newpass,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  delete(@Req() req, @Param("id", ParseIntPipe) id: number) {
    let token = req.headers.authorization;
    token = token.replace("Bearer ", "");
    const payload = this.jwt.verify(token, {
      secret: jwtConstants.secret,
    });
    return this.accountSerice.delete(id, payload);
  }
}
