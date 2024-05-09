import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PointsFormService } from "./points-form.service";

@Controller("points-form")
export class PointsFormController {
  constructor(public service: PointsFormService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getListAll(
    @Query("period") period: number,
    @Query("status") status: string,
    @Query("class") class_id: string,
    @Query("student") student: string,
    @Query("student_id") student_id: string,
  ) {
    return this.service.search(period, status, class_id, student, student_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  selfCreate(@Body() dto: any) {
    return this.service.selfCreate(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put("detail/:form_id")
  updateDetail(@Param("form_id", ParseIntPipe) id: number, @Body() dto: any) {
    return this.service.updateDetailPoint(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/check")
  checkFormInPeriod(@Body() dto: any) {
    return this.service.checkCreateInPeriod(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/report/pie")
  reportpie() {
    return this.service.getReportSum();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/report/bar")
  reportbar() {
    return this.service.getReportCount();
  }
}
