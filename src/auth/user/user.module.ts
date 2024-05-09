import { Module } from "@nestjs/common";
import { SqlConnectModule } from "src/database/postgres-query/sql-connect.module";
import { UserService } from "./user.service";

@Module({
  imports: [SqlConnectModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
