import { Test, TestingModule } from "@nestjs/testing";
import { of, throwError } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";
import { PostgresConfig } from "../../database/postgres/postgres-config.service";
import { NotificationsService } from "./notifications.service";

describe("NotificationsService", () => {
  let service: NotificationsService;
  let sql: SqlConnectService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService, SqlConnectService, PostgresConfig],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
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

  describe("getListView", () => {
    const expected = {
      status: "success",
      message: "Get list successfully",
      data: [],
    };
    it("should be call with parameter", () => {
      // Arrange
      jest.spyOn(service, "getListView").mockReturnValue(of(expected));
      // Act
      service.getListView();
      // Assert
      expect(service.getListView).toHaveBeenCalled;
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
      service.getListView();

      service.getListView().subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });
  });

  describe("create", () => {
    const expected = {
      status: "success",
      message: "create successfully",
      data: [1],
    };
    const dto = {
      title: "",
      content: "",
      status: "",
      period_id: 1,
    };
    it("should be call with params", () => {
      // Arrange
      jest.spyOn(service, "create").mockReturnValue(of(expected));
      // Act
      service.create(dto);
      // Assert
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it("should return data when create success", () => {
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
      service.create(dto);
      service.create(dto).subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });
  });

  describe("update", () => {
    const expected = {
      status: "success",
      message: "update successfully",
      data: [],
    };
    const dto = {
      title: "",
      content: "",
      status: "",
      period_id: 1,
    };
    it("should be call with params", () => {
      // Arrange
      jest.spyOn(service, "update").mockReturnValue(of(expected));
      // Act
      service.update(1, dto);
      // Assert
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it("should return message when update success", () => {
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
      service.update(1, dto);
      service.update(1, dto).subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });
  });

  describe("delete", () => {
    it("should be call and pipe sql query", () => {
      const expected = {
        status: "success",
        message: `delete noti 1 successfully`,
        data: [],
      };
      const SQLResult = {
        command: "",
        rowCount: 1,
        oid: null,
        rows: [],
        fields: [],
        _parsers: 0,
        _types: 0,
        RowCtor: null,
        rowAsArray: true,
      };
      // Arrange
      jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));
      // Act
      service.delete(1);
      // Assert
      service.delete(1).subscribe((res) => {
        expect(res).toStrictEqual(expected);
      });
    });

    it("should throw error if noti not exist", () => {
      const SQLResult = {
        command: "",
        rowCount: 0,
        oid: null,
        rows: [],
        fields: [],
        _parsers: 0,
        _types: 0,
        RowCtor: null,
        rowAsArray: true,
      };
      // Arrange
      jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));
      // Act
      service.delete(0);
      // Assert
      service.delete(0).subscribe((res) => {
        expect(res).toStrictEqual({
          statusCode: 404,
          message: "Không tìm thấy thông báo này",
          error: "Not Found",
        });
      });
    });
  });
});
