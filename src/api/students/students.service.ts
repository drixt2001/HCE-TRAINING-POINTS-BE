import { Injectable } from "@nestjs/common";
import { map } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";

@Injectable()
export class StudentsService {
  constructor(private readonly sql: SqlConnectService) {}

  getInfoForForm(id: number) {
    const sql = `SELECT s.id, s."name", s.birthday, s.gender, s.is_leader, c.full_name AS classname, m."name" AS major, p."name" AS role
    FROM student s, class c, major m, account a, role p 
    WHERE s.class_id = c.id AND c.major_id = m.id AND s.acc_id = a.id AND a.role_id = p.id AND s.id = ${id}`;
    return this.sql.query(sql).pipe(
      map((data) => {
        return {
          status: "success",
          message: "Get info successfully",
          data: data.rows[0],
        };
      }),
    );
  }
}
