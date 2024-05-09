import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { PostgresConfig } from "../postgres/postgres-config.service";
import { SqlConnectService } from "./sql-connect.service";

describe("SqlConnectService", () => {
  let service: SqlConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqlConnectService, PostgresConfig],
    }).compile();

    service = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("readFileSQL", () => {
    it("should return value when it is call", () => {
      // Arrange
      const filePath = "user/select-all.sql";
      // Act
      const fileValue = service.readFileSQL(filePath);
      // Assert
      expect(fileValue).toBeTruthy();
    });
  });
  describe("query", () => {
    it("should be call and return SQLResult", (done) => {
      // Arrange
      const param = [1];
      const spyQuery1 = jest.spyOn(service, "query");
      // Act
      service
        .query("Select * from period where id = $1", param)
        .subscribe(() => {
          done();
        });
      // Assert
      expect(spyQuery1).toHaveBeenCalledWith(
        "Select * from period where id = $1",
        param,
      );
    });
  });

  describe("queryLogin", () => {
    it("should be call and return SQLResult", async () => {
      // Arrange
      const param = [1];
      const spyQuery = jest.spyOn(service, "queryLogin");
      // Act
      await service.queryLogin("Select * from period where id = $1", param);
      // Assert
      expect(spyQuery).toHaveBeenCalledWith(
        "Select * from period where id = $1",
        param,
      );
    });
  });
});
