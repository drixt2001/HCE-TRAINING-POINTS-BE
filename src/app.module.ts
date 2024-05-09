import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SqlConnectModule } from "./database/postgres-query/sql-connect.module";
import { GroupCriteriaController } from "./api/group-criteria/group-criteria.controller";
import { GroupCriteriaService } from "./api/group-criteria/group-criteria.service";
import { NotificationsController } from "./api/notifications/notifications.controller";
import { NotificationsService } from "./api/notifications/notifications.service";
import { PeriodsController } from "./api/periods/periods.controller";
import { PeriodsService } from "./api/periods/periods.service";
import { CriteriaController } from "./api/criteria/criteria.controller";
import { CriteriaService } from "./api/criteria/criteria.service";
import { StudentsService } from "./api/students/students.service";
import { StudentsController } from "./api/students/students.controller";
import { PointsFormController } from "./api/points-form/points-form.controller";
import { PointsFormService } from "./api/points-form/points-form.service";
import { StatusController } from "./api/status/status.controller";
import { StatusService } from "./api/status/status.service";
import { ClassService } from "./api/class/class.service";
import { ClassController } from "./api/class/class.controller";
import { AuthModule } from "./auth/auth.module";
import { AccountController } from "./api/account/account.controller";
import { AccountService } from "./api/account/account.service";
import { UserModule } from "./auth/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ResultController } from './api/result/result.controller';
import { ResultService } from './api/result/result.service';

@Module({
  imports: [SqlConnectModule, AuthModule, UserModule, JwtModule],
  controllers: [
    AppController,
    GroupCriteriaController,
    NotificationsController,
    PeriodsController,
    CriteriaController,
    StudentsController,
    PointsFormController,
    StatusController,
    ClassController,
    AccountController,
    ResultController,
  ],
  providers: [
    AppService,
    GroupCriteriaService,
    NotificationsService,
    PeriodsService,
    CriteriaService,
    StudentsService,
    PointsFormService,
    StatusService,
    ClassService,
    AccountService,
    ResultService,
  ],
})
export class AppModule {}
