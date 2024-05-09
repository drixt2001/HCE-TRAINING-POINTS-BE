import { Injectable } from "@nestjs/common";
import { map } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";

@Injectable()
export class StatusService {
  constructor(private readonly sql: SqlConnectService) {}
  getList() {
    return this.sql
      .query(
        "SELECT id, title, description, created_at, updated_at, step FROM status order by step asc",
      )
      .pipe(
        map((data) => {
          return {
            status: "success",
            message: "Get list status successfully",
            data: data.rows,
          };
        }),
      );
  }
}
