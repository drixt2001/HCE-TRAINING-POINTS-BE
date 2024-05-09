import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";
import { PostgresConfig } from "../../database/postgres/postgres-config.service";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;
  let sql: SqlConnectService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, SqlConnectService, PostgresConfig, JwtService],
    }).compile();

    service = module.get<UserService>(UserService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findUserByEmail", () => {
    it("shoul be call with email parameter", async () => {
      // Arrange
      const email = "user@email.com";
      const find = jest.spyOn(service, "findUserByEmail");

      // Act
      await service.findUserByEmail(email);

      // Assert
      expect(find).toBeCalledTimes(1);
      expect(find).toHaveBeenCalledWith(email);
    });
    it("shoul call query and return value if result rowCount is 1", async () => {
      // Arrange
      const result = {
        command: "SELECT",
        rowCount: 1,
        oid: null,
        rows: [
          {
            id: 1,
            email: "user@email.com",
            password:
              "$2a$12$N2bmaifFFsT0khP6CqrAweiW7oiWYuMfxjqsFoLsksG1A4xdN.42O",
            created_at: new Date("2022-10-21T01:05:34.211Z"),
            updated_at: new Date("2022-10-21T01:05:34.211Z"),
            profile_id: 1,
          },
        ],
      };
      let expected;
      const user = result.rows[0];
      jest.spyOn(sql, "queryLogin").mockResolvedValue(result);

      // Act
      await service.findUserByEmail("user@email.com").then((data) => {
        expected = data;
      });

      // Assert
      expect(user).toStrictEqual(expected);
    });
    it("shoul call query and return null if result rowCount is not 1", async () => {
      // Arrange
      const result = {
        command: "SELECT",
        rowCount: 0,
        oid: null,
        rows: [],
      };
      let expected;
      jest.spyOn(sql, "queryLogin").mockResolvedValue(result);

      // Act
      await service.findUserByEmail("user@email.com").then((data) => {
        expected = data;
      });
      // Assert
      expect(expected).toBeNull();
    });
  });
});
