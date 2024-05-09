import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { mergeMap, of, EMPTY, throwIfEmpty, map, tap } from "rxjs";
import { SqlConnectService } from "./database/postgres-query/sql-connect.service";

@Injectable()
export class AppService {
  constructor(private readonly sql: SqlConnectService) {}
  getHello(id: string) {
    const sqlQuery = this.sql.readFileSQL("user/select-all.sql");

    return this.sql.query(sqlQuery).pipe(
      map((data) => {
        return {
          status: "success",
          message: "Get user successfully",
          data: data.rows,
        };
      }),
    );
  }
}
