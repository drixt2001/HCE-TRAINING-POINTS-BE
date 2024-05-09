import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AccountService } from "../api/account/account.service";
import { SqlConnectService } from "../database/postgres-query/sql-connect.service";
import { PostgresConfig } from "../database/postgres/postgres-config.service";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { UserService } from "./user/user.service";

describe("AuthService", () => {
  let service: AuthService;
  let jwt: JwtService;
  let userService: UserService;
  let sql: SqlConnectService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        SqlConnectService,
        PostgresConfig,
        JwtService,
        UserService,
        AccountService,
        JwtStrategy,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwt = module.get<JwtService>(JwtService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    it("shoul be call and return data", async () => {
      // Arrange
      const mockToken = "example.token";
      const expected = {
        status: "success",
        message: "Đăng nhập thành công",
        access_token: mockToken,
      };
      let response;
      const user = {
        id: 1,
        email: "user@email.com",
        password:
          "$2a$12$N2bmaifFFsT0khP6CqrAweiW7oiWYuMfxjqsFoLsksG1A4xdN.42O",
        profile_id: 1,
      };
      // await service.authentication(user.email, user.password);
      const login = jest.spyOn(service, "login");
      jest.spyOn(jwt, "signAsync").mockResolvedValue(mockToken);
      // Act
      await service.login(user).then((data) => {
        response = data;
      });

      // Assert
      expect(login).toBeCalledTimes(1);
      expect(login).toHaveBeenCalledWith(user);
      expect(response).toStrictEqual(expected);
    });
  });

  describe("validateUser", () => {
    const params = {
      email: "user@email.com",
      password: "password",
    };

    it("should call findUserByEmail", async () => {
      // Arrange
      const auth = jest.spyOn(service, "validateUser");
      const find = jest.spyOn(userService, "findUserByEmail");

      // Act
      await service.validateUser(params.email, params.password);

      // Assert
      expect(auth).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledTimes(1);
      expect(auth).toHaveBeenCalledWith(params.email, params.password);
      expect(find).toHaveBeenCalledWith(params.email);
    });

    describe("if findUserByEmail result is falsy", () => {
      it("should return null", async () => {
        const result = {
          command: "SELECT",
          rowCount: 0,
          oid: null,
          rows: [],
        };
        jest.spyOn(sql, "queryLogin").mockResolvedValue(result);
        await service
          .validateUser(params.email, params.password)
          .then((data) => {
            expect(data).toBeNull();
          });
      });
    });
  });
});
