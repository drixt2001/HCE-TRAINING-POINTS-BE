import { Injectable } from "@nestjs/common";
import { map } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";

@Injectable()
export class CriteriaService {
  constructor(private readonly sql: SqlConnectService) {}
  getList() {
    return this.sql
      .query(
        `SELECT c.id, c.title, max AS "maxPoint", gc.id AS "groupId" FROM criteria c, group_criteria gc WHERE c.group_id = gc.id ORDER BY c.id asc`,
      )
      .pipe(
        map((data) => {
          return {
            status: "success",
            message: "Get list successfully",
            data: data.rows,
          };
        }),
      );
  }
}
