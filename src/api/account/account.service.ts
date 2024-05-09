import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  catchError,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  throwError,
} from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";
import moment = require("moment");
import console = require("console");
@Injectable()
export class AccountService {
  constructor(private readonly sql: SqlConnectService) {}

  getList(role_id: string, email: string) {
    let queryCriteria = "";
    if (role_id !== "0") queryCriteria += `AND r.id = ${role_id} `;
    if (email) queryCriteria += `AND a.email ILIKE '%${email}%' `;
    return this.sql
      .query(
        `SELECT
        a.id, email, register_date, last_login, role_id, r."name" AS role_name, r.role_code 
        FROM
          account a,
          "role" r
        WHERE
          a.role_id = r.id ${queryCriteria}`,
      )
      .pipe(
        map((data) => {
          data.rows = data.rows.map((d) => {
            if (d.role_name == "Phòng CTSV") return { ...d, color: "red" };
            if (d.role_name == "CVHT") return { ...d, color: "orange" };
            return { ...d, color: "green" };
          });
          return {
            status: "success",
            message: "Get list accounts successfully",
            data: data.rows,
          };
        }),
      );
  }

  updateLastLogin(id: number) {
    const now = Date.now();
    const time = moment(now).format("YYYY-MM-DD HH:mm:ss");
    const query = `UPDATE account
      SET last_login= $1
      WHERE id = $2;
      `;
    const params = [time, id];
    return this.sql.query(query, params).pipe(
      map((data) => {
        return {
          status: "success",
          message: "updated last login time successfully",
          data: data.rows,
        };
      }),
    );
  }

  getAllRoles() {
    return this.sql.query(`SELECT * FROM "role"`).pipe(
      map((data) => {
        return {
          status: "success",
          message: "Get list roles successfully",
          data: data.rows,
        };
      }),
    );
  }

  create(dto: any) {
    if (dto.account) {
      return this.createAccount(dto).pipe(
        map((res) => res.id),
        switchMap((id) => {
          let infoQuery;
          let infoParams;
          if (dto.manager) {
            infoQuery = `INSERT INTO manager
                          (manager_id, "name", phone, address, acc_id)
                          VALUES($1, $2, $3, $4, $5) returning id;           
                          `;
            infoParams = [
              dto.manager.manager_id,
              dto.manager.name,
              dto.manager.phone,
              dto.manager.address,
              id,
            ];
            return this.sql
              .query(infoQuery, infoParams)
              .pipe(map((res) => res.rows[0].id));
          }
          if (dto.teacher) {
            infoQuery = `INSERT INTO teacher
                        (teacher_id, "name", unit, phone, address, acc_id)
                        VALUES($1, $2, $3, $4, $5, $6) returning id;
                          `;
            infoParams = [
              dto.teacher.teacher_id,
              dto.teacher.name,
              dto.teacher.unit,
              dto.teacher.phone,
              dto.teacher.address,
              id,
            ];
            return this.sql.query(infoQuery, infoParams).pipe(
              map((res) => res.rows[0].id),
              switchMap((teacher_id) => {
                return from(dto.teacher.class_id).pipe(
                  map((class_id: any) => {
                    const params = [teacher_id, class_id];
                    return this.sql
                      .query(
                        `INSERT INTO teacher_class
                      (teacher_id, class_id)
                      VALUES($1, $2);
                      `,
                        params,
                      )
                      .pipe();
                  }),
                );
              }),
            );
          }
          if (dto.student) {
            infoQuery = `INSERT INTO student
            (student_id, "name", birthday, is_leader, address, class_id, gender, phone, acc_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id ;                      
            `;
            infoParams = [
              dto.student.student_id,
              dto.student.name,
              dto.student.birthday,
              dto.student.is_leader,
              dto.student.address,
              dto.student.class_id,
              dto.student.gender,
              dto.student.phone,
              id,
            ];
            return this.sql
              .query(infoQuery, infoParams)
              .pipe(map((res) => res.rows[0].id));
          }
        }),
        map(() => {
          return {
            status: "success",
            message: "Create account and info successfully",
          };
        }),
      );
    }

    // let infoQuery
  }

  createAccount(dto: any) {
    const accQuery = `INSERT INTO account
      (email, "password", role_id)
      VALUES($1, $2, $3) RETURNING id;
      `;
    const accParams = [
      dto.account.email,
      dto.account.password,
      dto.account.role_id,
    ];
    return this.sql.query(accQuery, accParams).pipe(
      map((res) => {
        return {
          status: "success",
          message: "Tạo tài khoản công",
          id: res.rows[0].id,
        };
      }),
      catchError((err) => {
        if (err.code === "23505") {
          throw new ConflictException("Email đã được sử dụng");
        }
        return throwError(() => new Error(err));
      }),
    );
  }

  updateAccount(id: number, acc: any) {
    const accQuery = `UPDATE account SET email = $1, "password"= $2, role_id = $3 WHERE id = $4;
      `;
    const accParams = [acc.email, acc.password, acc.role_id, id];

    return this.sql.query(accQuery, accParams).pipe();
  }

  getInfo(email: string, role_code: any) {
    let sqlQuery;
    const param = [email];
    if (role_code === "1") {
      sqlQuery = `SELECT a.id, m.id as m_id, email, password, register_date, last_login, r."name" as role_name, m.manager_id, m."name", m.phone, m.address, r.id as role_id, r.role_code
      FROM account a, role r, manager m
      WHERE (a.role_id = r.id) and (a.id = m.acc_id) and a.email = $1
      `;
    } else if (role_code === "2") {
      sqlQuery = `select
      a.id,
      email,
      password,
      register_date,
      last_login,
      r."name" as role_name,
      t.teacher_id,
      t."name",
      t.phone,
      t.address,
      t.unit,
      r.id as role_id,
      t.id as tid,
      (
      select
        array_to_json(array_agg(listclass)) as list_class
      from
        (
        select
          c.short_name,
          c.full_name
        from
          teacher tch,
          teacher_class tc,
          "class" c
        where
          tch.id = tc.teacher_id
          and c.id = tc.class_id
          and tch.id = t.id
            ) listclass
          ),
      array(
      select
        c.id
      from
        teacher tch,
        teacher_class tc,
        "class" c
      where
        tch.id = tc.teacher_id
        and c.id = tc.class_id
        and tch.id = t.id
            ) as class_id
    from
      account a,
      "role" r,
      teacher t
    where
      (a.role_id = r.id)
      and (a.id = t.acc_id)
      AND a.email = $1
      `;
    } else {
      sqlQuery = `SELECT
            a.id,
            email,
            password,
            register_date,
            last_login,
            s.student_id,
            s."name",
            s.birthday,
            s.gender,
            s.is_leader,
            s.address,
            s.phone,
            c.full_name AS class_full,
            c.short_name AS class_short,
            c.id AS class_id,
            r."name" as role_name,
            s.id as sid,
            r.id as role_id
          FROM
            account a,
            "role" r,
            student s,
            "class" c
          WHERE
            (a.role_id = r.id)
            AND (a.id = s.acc_id)
            AND (c.id = s.class_id)
            AND a.email = $1
          `;
    }

    return this.sql.query(sqlQuery, param).pipe(
      map((res) => {
        if (res.rows[0]) return res.rows[0];
        else throw new NotFoundException("Không tìm thấy người dùng này");
      }),
    );
  }

  update(id: number, dto: any) {
    return this.updateAccount(id, dto.account).pipe(
      mergeMap(() => {
        if (dto.manager) {
          const sqlQuery = `UPDATE manager
          SET manager_id= $1, "name"= $2, phone= $3, address= $4
          WHERE acc_id = $5;
          `;
          const param = [
            dto.manager.manager_id,
            dto.manager.name,
            dto.manager.phone,
            dto.manager.address,
            id,
          ];
          return this.sql.query(sqlQuery, param).pipe();
        } else if (dto.teacher) {
          const sqlQuery = `UPDATE teacher
            SET teacher_id= $1, "name"= $2, unit= $3, phone= $4, address= $5
            WHERE acc_id= $6;
            `;
          const param = [
            dto.teacher.teacher_id,
            dto.teacher.name,
            dto.teacher.unit,
            dto.teacher.phone,
            dto.teacher.address,
            id,
          ];
          return this.sql.query(sqlQuery, param).pipe(
            map(() => {
              return dto.teacher.tid;
            }),
            switchMap((teacher_id) => {
              return this.sql
                .query(
                  `DELETE FROM teacher_class
                      WHERE teacher_id= $1
                    `,
                  [teacher_id],
                )
                .pipe(
                  switchMap(() => {
                    return from(dto.teacher.class_id).pipe(
                      map((class_id: any) => {
                        const params = [teacher_id, class_id];
                        return this.sql
                          .query(
                            `INSERT INTO teacher_class
                            (teacher_id, class_id)
                            VALUES($1, $2);
                            `,
                            params,
                          )
                          .pipe();
                      }),
                    );
                  }),
                );
            }),
          );
        } else {
          const sqlQuery = `UPDATE student
          SET student_id= $1, name= $2, birthday= $3, gender= $4, is_leader= $5, address= $6, phone= $7, class_id= $8
          WHERE acc_id = $9;
          `;
          const param = [
            dto.student.student_id,
            dto.student.name,
            dto.student.birthday,
            dto.student.gender,
            dto.student.is_leader,
            dto.student.address,
            dto.student.phone,
            dto.student.class_id,
            id,
          ];

          return this.sql.query(sqlQuery, param).pipe();
        }
      }),
      map(() => {
        return {
          status: "success",
          message: "Cập nhật dữ liệu thành công",
        };
      }),
    );
  }

  checkOldPass(email: string, pass: string) {
    return this.sql
      .query(`SELECT id FROM account a WHERE email = $1 and "password" = $2`, [
        email,
        pass,
      ])
      .pipe(
        map((res) => {
          if (res.rowCount == 1) return true;
          else return false;
        }),
      );
  }

  changepass(
    email: string,
    emailCheck: string,
    oldpass: string,
    newpass: string,
  ) {
    if (email !== emailCheck) {
      throw new ForbiddenException("Không có quyền");
    } else {
      return this.checkOldPass(emailCheck, oldpass).pipe(
        mergeMap((res) => {
          if (res == true) {
            return this.sql
              .query(`UPDATE account SET "password" = $1 WHERE email = $2`, [
                newpass,
                emailCheck,
              ])
              .pipe(
                map((res) => {
                  if (res)
                    return {
                      status: "success",
                      message: "Đổi mật khẩu thành công",
                    };
                }),
              );
          } else {
            throw new ForbiddenException("Sai mật khẩu cũ");
          }
        }),
      );
    }
  }

  delete(id: number, payload: any) {
    if (payload.id == id)
      throw new BadRequestException("Không thể xóa tài khoản của bạn!");
    if (payload.role === "1") {
      return this.sql.query("DELETE FROM account WHERE id = $1;", [id]).pipe(
        map((data) => {
          if (data.rowCount !== 1) {
            throw new NotFoundException(`Không tìm thấy tài khoản này`);
          } else {
            return {
              status: "success",
              message: `xóa tài khoản thành công`,
            };
          }
        }),
      );
    } else {
      throw new ForbiddenException("Không có quyền xóa");
    }
  }
}
