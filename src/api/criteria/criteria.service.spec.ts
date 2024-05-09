import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";
import { PostgresConfig } from "../../database/postgres/postgres-config.service";
import { CriteriaService } from "./criteria.service";

describe("CriteriaService", () => {
  let service: CriteriaService;
  let sql: SqlConnectService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CriteriaService, SqlConnectService, PostgresConfig],
    }).compile();

    service = module.get<CriteriaService>(CriteriaService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getList", () => {
    const expected = {
      status: "success",
      message: "Get list successfully",
      data: [],
    };
    it("should be call with parameter", () => {
      // Arrange
      jest.spyOn(service, "getList").mockReturnValue(of(expected));
      // Act
      service.getList();
      // Assert
      expect(service.getList).toHaveBeenCalled;
    });

    it("should query sql", () => {
      const SQLResult = {
        command: "",
        rowCount: 2,
        oid: null,
        rows: [],
        fields: [],
        _parsers: 0,
        _types: 0,
        RowCtor: null,
        rowAsArray: true,
      };
      jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));

      // Act
      service.getList();

      service.getList().subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });
  });
});
