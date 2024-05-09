import { Test, TestingModule } from "@nestjs/testing";
import { catchError, of, throwError } from "rxjs";
import { SqlConnectService } from "../../database/postgres-query/sql-connect.service";
import { PostgresConfig } from "../../database/postgres/postgres-config.service";
import { AccountService } from "./account.service";

describe("AccountService", () => {
  let service: AccountService;
  let sql: SqlConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, SqlConnectService, PostgresConfig],
    }).compile();

    service = module.get<AccountService>(AccountService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getList", () => {
    const expected = {
      status: "success",
      message: "Get list accounts successfully",
      data: [],
    };
    it("should be call with parameter", () => {
      // Arrange
      jest.spyOn(service, "getList").mockReturnValue(of(expected));
      // Act
      service.getList("1", "email");
      // Assert
      expect(service.getList).toHaveBeenCalledWith("1", "email");
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
      service.getList("1", "email");

      service.getList("1", "email").subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });
  });

  describe("updateLastLogin", () => {
    const expected = {
      status: "success",
      message: "updated last login time successfully",
      data: [],
    };
    it("should be call with id parameter", () => {
      // Arrange
      jest.spyOn(service, "updateLastLogin").mockReturnValue(of(expected));
      // Act
      service.updateLastLogin(1);
      // Assert
      expect(service.updateLastLogin).toHaveBeenCalledWith(1);
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
      service.updateLastLogin(1);

      service.updateLastLogin(1).subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });
  });

  describe("getAllRoles", () => {
    const expected = {
      status: "success",
      message: "Get list roles successfully",
      data: [],
    };
    it("should be call", () => {
      // Arrange
      jest.spyOn(service, "getAllRoles").mockReturnValue(of(expected));
      // Act
      service.getAllRoles();
      // Assert
      expect(service.getAllRoles).toHaveBeenCalledTimes(1);
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
      service.getAllRoles();

      service.getAllRoles().subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });
  });

  describe("create info for account", () => {
    const expected = {
      status: "success",
      message: "Create account and info successfully",
    };
    it("should be call with param", () => {
      // Arrange
      jest.spyOn(service, "create").mockReturnValue(of(expected));
      // Act
      service.create("any");
      // Assert
      expect(service.create).toHaveBeenCalledWith("any");
    });

    describe("should check dto has account object", () => {
      const expected = {
        status: "success",
        message: "Create account and info successfully",
      };
      const SQLResult = {
        command: "",
        rowCount: 2,
        oid: null,
        rows: [{ id: 1 }],
        fields: [],
        _parsers: 0,
        _types: 0,
        RowCtor: null,
        rowAsArray: true,
      };

      it("dto manager", () => {
        const dto = {
          account: {
            email: "any" + Date.now(),
            password: "any",
            role_id: 1,
          },
          manager: "manager mock",
        };

        service.create(dto);

        const mock = {
          status: "success",
          message: "Tạo tài khoản công",
          id: 1,
        };
        jest.spyOn(service, "createAccount").mockReturnValue(of(mock));
        jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));

        service.create(dto).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });

      it("dto teacher", () => {
        const dto = {
          account: {
            email: "any" + Date.now(),
            password: "any",
            role_id: 1,
          },
          teacher: {
            class_id: ["1"],
          },
        };

        service.create(dto);

        const mock = {
          status: "success",
          message: "Tạo tài khoản công",
          id: 1,
        };
        jest.spyOn(service, "createAccount").mockReturnValue(of(mock));
        jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));

        service.create(dto).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });

      it("dto student", () => {
        const dto = {
          account: {
            email: "any" + Date.now(),
            password: "any",
            role_id: 1,
          },
          student: "student mock",
        };

        service.create(dto);

        const mock = {
          status: "success",
          message: "Tạo tài khoản công",
          id: 1,
        };
        jest.spyOn(service, "createAccount").mockReturnValue(of(mock));
        jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));

        service.create(dto).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });
    });
  });

  describe("createAccount", () => {
    const expected = {
      status: "success",
      message: "Tạo tài khoản công",
      id: 1,
    };
    it("should be call with params", () => {
      // Arrange
      jest.spyOn(service, "createAccount").mockReturnValue(of(expected));
      // Act
      service.createAccount("any");
      // Assert
      expect(service.createAccount).toHaveBeenCalledWith("any");
    });

    it("should throw ConflictException if email is exist", () => {
      const dto = {
        account: {
          email: "email",
          password: "pass",
          role_id: "1",
        },
      };
      // Arrange
      jest.spyOn(sql, "query").mockReturnValue(throwError(() => new Error()));

      // Act
      service.createAccount(dto);

      // Assert
      service
        .createAccount(dto)
        .pipe(
          catchError((err) => {
            return of(err);
          }),
        )
        .subscribe();
    });

    it("should return data when create success", () => {
      const dto = {
        account: {
          email: "email",
          password: "pass",
          role_id: "1",
        },
      };
      const SQLResult = {
        command: "",
        rowCount: 2,
        oid: null,
        rows: [{ id: 1 }],
        fields: [],
        _parsers: 0,
        _types: 0,
        RowCtor: null,
        rowAsArray: true,
      };

      jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));

      // Act
      service.createAccount(dto);
      service.createAccount(dto).subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });
  });

  describe("updateAccount", () => {
    const SQLResult = {
      command: "",
      rowCount: 2,
      oid: null,
      rows: [{ id: 1 }],
      fields: [],
      _parsers: 0,
      _types: 0,
      RowCtor: null,
      rowAsArray: true,
    };
    it("should be call and pipe sql query", () => {
      const acc = {
        email: "email",
        password: "pass",
        role_id: "1",
      };
      // Arrange
      jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));
      // Act
      service.updateAccount(1, acc);
      // Assert

      const accQuery = `UPDATE account SET email = $1, "password"= $2, role_id = $3 WHERE id = $4;
      `;
      const accParams = [acc.email, acc.password, acc.role_id, 1];
      expect(sql.query).toHaveBeenCalledWith(accQuery, accParams);
    });
  });

  describe("getInfo", () => {
    const expected = {
      id: 1,
    };
    it("should be call", () => {
      // Arrange
      jest.spyOn(service, "getInfo").mockReturnValue(of(expected));
      // Act
      service.getInfo("email", "1");
      // Assert
      expect(service.getInfo).toHaveBeenCalledTimes(1);
    });

    it("should query sql and return", () => {
      const SQLResult = {
        command: "",
        rowCount: 2,
        oid: null,
        rows: [{ id: 1 }],
        fields: [],
        _parsers: 0,
        _types: 0,
        RowCtor: null,
        rowAsArray: true,
      };
      jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));

      // Act
      service.getInfo("email", "1");

      service.getInfo("email", "1").subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });

      // Act
      service.getInfo("email", "2");

      service.getInfo("email", "2").subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });

      // Act
      service.getInfo("email", "3");

      service.getInfo("email", "3").subscribe((data) => {
        expect(data).toStrictEqual(expected);
      });
    });

    it("should throw not found when not exist", () => {
      const SQLResultFail = {
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
      jest.spyOn(sql, "query").mockReturnValue(of(SQLResultFail));
      service.getInfo("email", "3").pipe(catchError((err) => of(err)));
    });
  });

  describe("update info", () => {
    const expected = {
      status: "success",
      message: "Cập nhật dữ liệu thành công",
    };
    it("should be call", () => {
      // Arrange
      jest.spyOn(service, "update").mockReturnValue(of(expected));
      // Act
      service.update(1, "dto");
      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    describe("should pipe update account", () => {
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

      it("dto manager", () => {
        const dto = {
          account: {
            email: "any" + Date.now(),
            password: "any",
            role_id: 1,
          },
          manager: "manager mock",
        };
        jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));
        jest.spyOn(service, "updateAccount").mockReturnValue(of(SQLResult));
        // Act
        service.update(1, dto);

        service.update(1, dto).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });

      it("dto teacher", () => {
        const dto = {
          account: {
            email: "any" + Date.now(),
            password: "any",
            role_id: 1,
          },
          teacher: {
            class_id: ["1"],
          },
        };
        jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));
        jest.spyOn(service, "updateAccount").mockReturnValue(of(SQLResult));
        // Act
        service.update(1, dto);

        service.update(1, dto).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });

      it("dto student", () => {
        const dto = {
          account: {
            email: "any" + Date.now(),
            password: "any",
            role_id: 1,
          },
          student: "student mock",
        };
        jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));
        jest.spyOn(service, "updateAccount").mockReturnValue(of(SQLResult));
        // Act
        service.update(1, dto);

        service.update(1, dto).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });
    });
  });

  describe("checkOldPass", () => {
    it("should be call and return true", () => {
      const expected = true;
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
      service.checkOldPass("email", "pass");
      // Assert
      service.checkOldPass("email", "pass").subscribe((res) => {
        expect(res).toBe(expected);
      });
    });

    it("should be call and return false", () => {
      const expected = false;
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
      service.checkOldPass("email", "pass");
      // Assert
      service.checkOldPass("email", "pass").subscribe((res) => {
        expect(res).toBe(expected);
      });
    });
  });

  describe("changepass", () => {
    it("should be call and pipe checkOldPass", () => {
      const expected = {
        status: "success",
        message: "Đổi mật khẩu thành công",
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
      jest.spyOn(service, "checkOldPass").mockReturnValue(of(true));
      jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));
      // Act
      service.changepass("email", "email", "opass", "npass");
      // Assert
      service
        .changepass("email", "email", "opass", "npass")
        .subscribe((res) => {
          expect(res).toStrictEqual(expected);
        });
    });
  });

  describe("delete", () => {
    it("should be call and pipe sql query", () => {
      const expected = {
        status: "success",
        message: `xóa tài khoản thành công`,
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
      jest.spyOn(service, "checkOldPass").mockReturnValue(of(true));
      jest.spyOn(sql, "query").mockReturnValue(of(SQLResult));
      // Act
      service.delete(1, { id: 2, role: "1" });
      // Assert
      service.delete(1, { id: 2, role: "1" }).subscribe((res) => {
        expect(res).toStrictEqual(expected);
      });
    });
  });
});
