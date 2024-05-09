import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import e from "express";
import { from, map, mergeMap, switchMap } from "rxjs";
import { SqlConnectService } from "src/database/postgres-query/sql-connect.service";

@Injectable()
export class PointsFormService {
  constructor(private readonly sql: SqlConnectService) {}

  selfCreate(dto: FormDTO) {
    const sqlInsertForm = `INSERT INTO pointsform (period_id, student_id, status_id) VALUES($1, $2, $3) RETURNING id`;
    const sqlInsertSelf = `INSERT INTO points_criteria_list (criteria_id, form_id, self_point) VALUES($1, $2, $3)`;

    return this.checkCreateInPeriod(dto).pipe(
      map((res) => {
        if (res == true) return true;
        else
          throw new BadRequestException("Bạn đã tạo phiếu trong kỳ này rồi!");
      }),
      switchMap(() => {
        return this.sql
          .query(sqlInsertForm, [dto.period_id, dto.student_id, 1])
          .pipe(
            map((data) => data.rows[0]),
            switchMap((res) => {
              return from(dto.points).pipe(
                map((self: any) => {
                  const paramsUser_Role = [
                    self.criteria_id,
                    res.id,
                    self.self_point !== "" ? self.self_point : 0,
                  ];
                  return this.sql.query(sqlInsertSelf, paramsUser_Role).pipe();
                }),
              );
            }),
            map(() => {
              return {
                status: "success",
                message: "Send self points successfully",
              };
            }),
          );
      }),
    );
  }

  updateDetailPoint(id: number, dto: any) {
    const sql = `UPDATE
          points_criteria_list
        SET
          self_point = $1,
          approval_point = $2
        WHERE
          criteria_id = $3
          AND form_id = $4`;

    return from(dto).pipe(
      map((point: any) => {
        const params = [
          point.self_point !== "" ? point.self_point : 0,
          point.approval_point !== "" ? point.approval_point : 0,
          point.criteria_id,
          id,
        ];
        return this.sql.query(sql, params).pipe(
          map(() => {
            return {
              status: "success",
              message: "Cập nhật phiếu thành công",
            };
          }),
        );
      }),
    );
  }
  checkCreateInPeriod(dto: FormDTO) {
    const sql = `SELECT s.id, s."name", p.title, p.id, f.id, sum(pcl.self_point)
    FROM student s, "period" p, pointsform f, points_criteria_list pcl 
    WHERE (s.id = f.student_id) AND (p.id = f.period_id) AND (f.id = pcl.form_id) AND (p.id = $1) AND (s.id = $2)
    GROUP BY s.id, p.title, p.id, f.id`;
    const params = [dto.period_id, dto.student_id];
    return this.sql.query(sql, params).pipe(
      map((data) => {
        if (!data.rowCount) {
          return true;
        }
        return false;
      }),
    );
  }

  getListAll() {
    const query = `SELECT
    f.id AS id,
    s.id AS sid,
    s.student_id,
    s.birthday,
    p.id AS period_id,
    s."name" AS student_name,
    c.short_name AS "class",
    f.created_at,
    st.title AS status,
    sum(pcl.self_point) AS form_point,
    sum(pcl.approval_point) AS approval_point,
    f.confirm_point,
    f.result_point
  FROM
    student s,
    "period" p,
    pointsform f,
    points_criteria_list pcl,
    "class" c,
    status st
  WHERE
    s.id = f.student_id
    AND p.id = f.period_id
    AND f.id = pcl.form_id
    AND s.class_id = c.id
    AND f.status_id = st.id
  GROUP BY
    f.id,
    s.id,
    s.student_id,
    s.birthday,
    p.id,
    s."name",
    c.short_name,
    f.created_at,
    st.title`;

    return this.sql.query(query).pipe(
      map((data) => {
        return {
          status: "success",
          message: "Get list form successfully",
          data: data.rows,
        };
      }),
    );
  }

  search(
    period?: number,
    status = "[]",
    class_id = "[]",
    student?: string,
    student_id?: string,
  ) {
    let queryCriteria = "";
    if (period != 0) queryCriteria += `AND p.id = ${period} `;

    const statusList = JSON.parse(`${status}`);
    if (statusList.length) {
      queryCriteria += `AND st.id = ANY(ARRAY[${statusList}]::int[])`;
    }

    const classList = JSON.parse(`${class_id}`);
    if (classList.length) {
      queryCriteria += `AND c.id = ANY(ARRAY[${classList}]::int[]) `;
    }
    if (student) queryCriteria += `AND s."name" ILIKE '%${student}%' `;

    if (student_id !== "undefined") queryCriteria += `AND s.id = ${student_id}`;

    const query = `SELECT
    f.id AS id,
    s.id AS sid,
    s.student_id,
    s.birthday,
    p.id AS period_id,
    p.title AS period,
    s."name" AS student_name,
    c.short_name AS "class",
    f.created_at,
    st.title AS status,
    sum(pcl.self_point) AS form_point,
    sum(pcl.approval_point) AS approval_point,
    f.confirm_point,
    f.result_point
  FROM
    student s,
    "period" p,
    pointsform f,
    points_criteria_list pcl,
    "class" c,
    status st
  WHERE
    s.id = f.student_id
    AND p.id = f.period_id
    AND f.id = pcl.form_id
    AND s.class_id = c.id
    AND f.status_id = st.id
    ${queryCriteria}
  GROUP BY
    f.id,
    s.id,
    s.student_id,
    s.birthday,
    p.id,
    s."name",
    c.short_name,
    f.created_at,
    st.title
  ORDER BY p."start" asc`;

    return this.sql.query(query).pipe(
      map((data) => {
        return {
          status: "success",
          message: "Get list form successfully",
          data: data.rows,
        };
      }),
    );
  }

  getOne(id: number) {
    const query = `SELECT
    f.id,
    p.id AS "period_id",
    p.title as "period_title",
    s.id AS "status_id",
    s.step as "step",
    st.id AS student_id,
    confirm_point,
    result_point,
    (
    SELECT
      sum(self_point)
    FROM
      points_criteria_list
    WHERE
      form_id = $1
    GROUP BY
      form_id
  ) AS "total_self",
    (SELECT sum(approval_point)
    FROM points_criteria_list
    WHERE form_id = $1
    GROUP BY form_id
  )  AS "total_approval",
    f.created_at AS "form_create"
  FROM
    pointsform f,
    status s,
    "period" p,
    student st
  WHERE
    f.id = $1
    AND (p.id = f.period_id )
    AND (st.id = f.student_id)
    AND (f.status_id = s.id)`;

    return this.sql.query(query, [id]).pipe(
      mergeMap((data) => {
        if (!data.rows[0]) {
          throw new NotFoundException("Không có phiếu này!");
        } else
          return this.getPointsOfForm(data.rows[0].id).pipe(
            map((res) => {
              return {
                status: "success",
                message: "Get points of form successfully",
                data: { ...data.rows[0], points: res.data },
              };
            }),
          );
      }),
    );
  }

  getPointsOfForm(id: number) {
    const query = `SELECT
      c.id AS criteria_id,
      self_point,
      approval_point
    FROM
      points_criteria_list pcl,
      criteria c
    WHERE
      pcl.form_id = $1
      AND (pcl.criteria_id = c.id)
    `;
    return this.sql.query(query, [id]).pipe(
      map((data) => {
        return {
          status: "success",
          message: "Get points of form successfully",
          data: data.rows,
        };
      }),
    );
  }

  update(id: number, dto: any) {
    const query_rs = `UPDATE pointsform SET status_id = $1, confirm_point = $2, result_point = $3 WHERE id = $4`;
    const params_rs = [dto.status_id, dto.confirm_point, dto.result_point, id];

    return this.sql.query(query_rs, params_rs).pipe(
      map((data) => {
        if (data.rowCount !== 1) {
          throw new NotFoundException("Không có phiếu này!");
        } else
          return {
            status: "success",
            message: "Cập nhật thông tin phiếu thành công!",
          };
      }),
    );
  }

  getReportSum() {
    return this.sql.query("SELECT result_point FROM pointsform p").pipe(
      map((res) => {
        const data = {
          xuatsac: 0,
          gioi: 0,
          kha: 0,
          trungbinh: 0,
          yeu: 0,
          kem: 0,
        };
        res.rows.map((value) => {
          const point = value.result_point;
          if (point >= 90) data.xuatsac++;
          else if (point >= 80) data.gioi++;
          else if (point >= 65) data.kha++;
          else if (point >= 50) data.trungbinh++;
          else if (point >= 35) data.yeu++;
          else data.kem++;
        });
        return {
          status: "success",
          message: "Get report successfully",
          data: data,
        };
      }),
    );
  }

  getReportCount() {
    const sql = `SELECT p.title, count(f.result_point)
    FROM pointsform f, "period" p WHERE p.id = f.period_id 
    GROUP BY p.title `;
    return this.sql.query(sql).pipe(
      map((res) => {
        return {
          status: "success",
          message: "Get report Count successfully",
          data: res.rows,
        };
      }),
    );
  }
}

export interface FormDTO {
  period_id: number;
  student_id: number;
  points?: any[];
}
