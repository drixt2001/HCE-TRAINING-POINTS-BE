import { Injectable } from "@nestjs/common";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";

@Injectable()
export class UserService {
  constructor(private readonly sql: SqlConnectService) {}

  async findUserByEmail(email: string) {
    const res = await this.sql.queryLogin(
      `SELECT a.id, email, password, register_date, a.role_id, r.name as role_name, r.role_code, last_login FROM account a, role r WHERE (a.role_id = r.id) AND email = $1`,
      [email],
    );
    if (res.rowCount === 1) {
      const user = res.rows[0];
      return user;
    }
    return null;
  }
}
