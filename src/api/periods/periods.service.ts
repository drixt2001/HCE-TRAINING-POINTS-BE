import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { map, mergeMap } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";

@Injectable()
export class PeriodsService {
  constructor(private readonly sql: SqlConnectService) {}

  getList() {
    const query = `SELECT
    id,
    title,
    START,
    "end",
    (
    SELECT
      array_to_json(array_agg(noti)) AS noti
    FROM
      (
      SELECT
        n.id
      FROM
        notifications n ,
        "period" p
      WHERE
        n.period_id = PERIOD.id AND p.id = PERIOD.id ) noti),
    (
    SELECT
      array_to_json(array_agg(form)) AS form
    FROM
      (
      SELECT
        pf.id
      FROM
        pointsform pf ,
        "period" p
      WHERE
        pf.period_id = PERIOD.id AND p.id = PERIOD.id ) form)
  FROM
    PERIOD
  ORDER BY
    START DESC`;
    return this.sql.query(query).pipe(
      map((data) => {
        return {
          status: "success",
          message: "Get list successfully",
          data: data.rows,
        };
      }),
    );
  }

  activeNow() {
    return this.sql
      .query(
        `SELECT id, title, "start", "end" FROM "period" WHERE "start" <= CURRENT_DATE AND "end" >= CURRENT_DATE`,
      )
      .pipe(
        map((data) => {
          return {
            status: "success",
            message: "Get active period successfully",
            data: data.rows,
          };
        }),
      );
  }

  checkTimeUsing(start: string) {
    return this.sql
      .query(
        `SELECT id, title, "start", "end" FROM "period" WHERE "end" >= $1`,
        [start],
      )
      .pipe(
        map((data) => {
          if (data.rowCount) return true;
          else return false;
        }),
      );
  }

  create(dto: any) {
    const params = [dto.title, dto.start, dto.end];
    return this.checkTimeUsing(dto.start).pipe(
      mergeMap((res) => {
        if (res === false) {
          return this.sql
            .query(
              `INSERT INTO "period" (title, "start", "end") VALUES ($1, $2, $3)`,
              params,
            )
            .pipe(
              map((data) => {
                return {
                  status: "success",
                  message: "Create period successfully",
                  data: data.rows,
                };
              }),
            );
        } else {
          throw new BadRequestException(
            "Kỳ bạn tạo có thời gian trước một kỳ khác kết thúc!",
          );
        }
      }),
    );
  }

  update(id, dto) {
    const query = `UPDATE "period" SET title=$1, "start"=$2, "end"=$3 WHERE id = $4`;
    const params = [dto.title, dto.start, dto.end, id];

    return this.sql.query(query, params).pipe(
      map((data) => {
        return {
          status: "success",
          message: "update successfully",
          data: data.rows,
        };
      }),
    );
  }

  delete(id) {
    return this.sql.query("DELETE FROM period WHERE id = $1;", [id]).pipe(
      map((data) => {
        if (data.rowCount !== 1) {
          throw new NotFoundException(`Không tìm thấy kỳ này`);
        } else {
          return {
            status: "success",
            message: `delete period ${id} successfully`,
            data: data.rows,
          };
        }
      }),
    );
  }
}
