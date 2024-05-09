import { Injectable, NotFoundException } from "@nestjs/common";
import { map } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";
import { CreateNoti } from "./dto/create";

@Injectable()
export class NotificationsService {
  constructor(private readonly sql: SqlConnectService) {}

  getList() {
    return this.sql
      .query(
        "SELECT n.id, n.title, content, p.title AS period, p.id AS period_id, status FROM notifications n, period p WHERE n.period_id = p.id order by id desc",
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

  getListView() {
    return this.sql
      .query(
        "SELECT n.id, n.title, content, p.title AS period, p.id AS period_id, status FROM notifications n, period p WHERE n.period_id = p.id and status = 'public' order by id desc",
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

  create(dto: CreateNoti) {
    const params = [dto.title, dto.content, dto.status, dto.period_id];
    return this.sql
      .query(
        "INSERT INTO notifications (title, content, status, period_id) VALUES($1,$2,$3,$4)",
        params,
      )
      .pipe(
        map((data) => {
          return {
            status: "success",
            message: "create successfully",
            data: data.rows,
          };
        }),
      );
  }

  update(id: number, dto: CreateNoti) {
    const params = [dto.title, dto.content, dto.status, dto.period_id, id];
    return this.sql
      .query(
        "UPDATE notifications notifications SET title = $1, content = $2, status = $3, period_id =$4 WHERE id = $5",
        params,
      )
      .pipe(
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
    return this.sql
      .query("DELETE FROM notifications WHERE id = $1;", [id])
      .pipe(
        map((data) => {
          if (data.rowCount !== 1) {
            throw new NotFoundException(`Không tìm thấy thông báo này`);
          } else {
            return {
              status: "success",
              message: `delete noti ${id} successfully`,
              data: data.rows,
            };
          }
        }),
      );
  }
}
