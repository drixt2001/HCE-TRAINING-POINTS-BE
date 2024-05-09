import { Injectable } from "@nestjs/common";
import { map } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";

@Injectable()
export class ClassService {
  constructor(private readonly sql: SqlConnectService) {}
  getList() {
    return this.sql
      .query(
        "SELECT id, full_name AS fullname, short_name AS shortname FROM class",
      )
      .pipe(
        map((data) => {
          return {
            status: "success",
            message: "Get list class successfully",
            data: data.rows,
          };
        }),
      );
  }

  getClassOfTeacher(teacher_id: number) {
    return this.sql
      .query(
        `SELECT
            id, full_name, short_name
          FROM
            "class" c, teacher_class tc
          WHERE
            (c.id = tc.class_id) AND 
            tc.teacher_id = $1
          ORDER BY id asc`,
        [teacher_id],
      )
      .pipe(
        map((data) => {
          return {
            status: "success",
            message: "Get class of teacher successfully",
            data: data.rows,
          };
        }),
      );
  }
}
