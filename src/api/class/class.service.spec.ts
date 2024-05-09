import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";
import { PostgresConfig } from "../../database/postgres/postgres-config.service";
import { ClassService } from "./class.service";

describe("ClassService", () => {
  let service: ClassService;
  let sql: SqlConnectService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassService, SqlConnectService, PostgresConfig],
    }).compile();

    service = module.get<ClassService>(ClassService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getList", () => {
    const expected = {
      status: "success",
      message: "Get list class successfully",
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

  describe("getClassOfTeacher", () => {
    const expected = {
      status: "success",
      message: "Get class of teacher successfully",
      data: [1],
    };
    it("should be call with parameter", () => {
      // Arrange
      jest.spyOn(service, "getClassOfTeacher").mockReturnValue(of(expected));
      // Act
      service.getClassOfTeacher(1);
      // Assert
      expect(service.getClassOfTeacher).toHaveBeenCalledWith(1);
    });

    it("should query sql", () => {
      const SQLResult = {
        command: "",
        rowCount: 2,
        oid: null,
        rows: [1],
        fields: [],
        _parsers: 0,
        _types: 0,
        RowCtor: null,
        rowAsArray: true,
      };
      jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));

      // Act
      service.getClassOfTeacher(1);

      service.getClassOfTeacher(1).subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });
  });
});
