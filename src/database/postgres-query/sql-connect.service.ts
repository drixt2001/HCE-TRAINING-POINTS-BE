import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { Pool } from "pg";
import { from, map } from "rxjs";
import { PostgresConfig } from "../postgres/postgres-config.service";
import * as path from "path";
import { SQLResult } from "src/interfaces/sql/sql-result";

@Injectable()
export class SqlConnectService {
  constructor(private readonly pgConfig: PostgresConfig) {}

  optionConnect = process.env.POSTGRES_URL
    ? { connectionString: process.env.POSTGRES_URL }
    : {
        host: this.pgConfig.postgres.host,
        database: this.pgConfig.postgres.database,
        user: this.pgConfig.postgres.user,
        password: this.pgConfig.postgres.password,
        port: this.pgConfig.postgres.port,
      };

  public query(text: string, params?: Array<unknown>) {
    const pool = new Pool(this.optionConnect);
    return from(pool.query(text, params)).pipe(
      map((res) => {
        pool.end();
        return res as SQLResult;
      }),
    );
  }
  public async queryLogin(text: string, params?: Array<unknown>) {
    const pool = new Pool(this.optionConnect);
    const res = await pool.query(text, params);
    pool.end();
    return res;
  }
  public readFileSQL(fileSqlName: string) {
    const sqlFilePath = path.join(__dirname, `../../assets/sql/${fileSqlName}`);
    return readFileSync(sqlFilePath).toString();
  }
}
