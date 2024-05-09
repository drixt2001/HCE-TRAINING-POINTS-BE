import { Injectable } from "@nestjs/common";
import { map } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";

@Injectable()
export class GroupCriteriaService {
  constructor(private readonly sql: SqlConnectService) {}

  getList() {
    return this.sql
      .query("Select * from group_criteria order by index asc")
      .pipe(
        map((data) => {
          return {
            status: "success",
            message: "Get group successfully",
            data: data.rows,
          };
        }),
      );
  }
}
