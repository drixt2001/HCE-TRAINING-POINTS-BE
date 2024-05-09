import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { UserModule } from "./user/user.module";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
import { AccountService } from "src/api/account/account.service";
import { SqlConnectModule } from "src/database/postgres-query/sql-connect.module";
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "3d" },
    }),
    SqlConnectModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AccountService],
  exports: [AuthService],
})
export class AuthModule {}
