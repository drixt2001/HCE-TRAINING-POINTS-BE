import { Injectable, NotFoundException } from "@nestjs/common";
import { map, of, switchMap } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";

@Injectable()
export class ResultService {
  constructor(private readonly sql: SqlConnectService) {}

  getListAll(class_id = "[]", student?: string) {
    let queryCriteria = "";

    const classList = JSON.parse(`${class_id}`);
    if (classList.length) {
      queryCriteria += `AND c.id = ANY(ARRAY[${classList}]::int[]) `;
    }
    if (student) queryCriteria += `AND s."name" ILIKE '%${student}%' `;

    const sql = `SELECT
    p.student_id AS sid,
    s.student_id,
    s."name" AS student_name,
    s.birthday,
    c.short_name AS "class",
    avg(result_point) AS result_point
  FROM
    pointsform p,
    student s,
    "class" c
  WHERE
    (p.student_id = s.id)
    AND (s.class_id = c.id)
    AND (p.result_point NOTNULL)
    ${queryCriteria}
  GROUP BY
    p.student_id,
    s.student_id,
    s."name",
    s.birthday,
    c.short_name`;

    const queryRank = `SELECT
      p.student_id AS sid,
      avg(result_point) AS result_point,
      RANK () OVER (
    ORDER BY
      avg(result_point) DESC 
        ) RANK
    FROM
      pointsform p,
      student s,
      "class" c
    WHERE
      (p.student_id = s.id)
      AND (s.class_id = c.id)
      AND (p.result_point NOTNULL)
    
    GROUP BY
      p.student_id`;

    return this.sql.query(sql).pipe(
      switchMap((data) => {
        return this.sql.query(queryRank).pipe(
          map((res) => {
            const datas = data.rows.map((row) => {
              return {
                ...row,
                rank: res.rows.filter((rank) => {
                  return rank.sid == row.sid;
                })[0].rank,
              };
            });
            return {
              status: "success",
              message: "Get list result successfully",
              data: datas,
            };
          }),
        );
      }),
    );
  }

  getOne(student_id: number) {
    const sql = `SELECT
    p.student_id AS sid,
    s.student_id,
    s."name" AS student_name,
    s.birthday,
    c.short_name AS "class",
    avg(result_point) AS result_point
  FROM
    pointsform p,
    student s,
    "class" c
  WHERE
    (p.student_id = s.id)
    AND (s.class_id = c.id)
    AND (p.result_point NOTNULL)
    AND (s.id = ${student_id})
  GROUP BY
    p.student_id,
    s.student_id,
    s."name",
    s.birthday,
    c.short_name`;

    const queryRank = `SELECT
      p.student_id AS sid,
      avg(result_point) AS result_point,
      RANK () OVER (
    ORDER BY
      avg(result_point) DESC 
        ) RANK
    FROM
      pointsform p,
      student s,
      "class" c
    WHERE
      (p.student_id = s.id)
      AND (s.class_id = c.id)
      AND (p.result_point NOTNULL)
    
    GROUP BY
      p.student_id`;

    return this.sql.query(sql).pipe(
      switchMap((data) => {
        if (data.rowCount) {
          return this.sql.query(queryRank).pipe(
            map((res) => {
              let rank = 0;
              if (res.rowCount > 0) {
                rank = res.rows.filter((val) => {
                  if (val.sid == data.rows[0].sid) return val;
                })[0].rank;
              }

              data.rows[0].rank = rank;
              return {
                status: "success",
                message: "Get rank result successfully",
                data: data.rows[0],
              };
            }),
          );
        } else {
          return of(null);
        }
      }),
    );
  }

  getDetail(student_id: number) {
    const sql = `SELECT
    p.student_id AS sid,
    result_point,
    pe.title AS period
  FROM
    pointsform p,
    student s,
    "class" c,
    "period" pe
  WHERE
    (p.student_id = s.id)
    AND (s.class_id = c.id)
    AND (pe.id = p.period_id)
    AND (p.result_point NOTNULL)
    AND (s.id = $1)
  ORDER BY pe."start" asc`;
    const param = [student_id];

    return this.sql.query(sql, param).pipe(
      map((data) => {
        return {
          status: "success",
          message: "Get detail result points of student successfully",
          data: data.rows,
        };
      }),
    );
  }
}
