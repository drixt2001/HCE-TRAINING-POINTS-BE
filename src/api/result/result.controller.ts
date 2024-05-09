import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { ResultService } from "./result.service";

@Controller("result")
export class ResultController {
  constructor(public service: ResultService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getListAll(
    @Query("class") class_id: string,
    @Query("student") student: string,
  ) {
    return this.service.getListAll(class_id, student);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":sid")
  getOne(@Param("sid", ParseIntPipe) sid: number) {
    return this.service.getOne(sid);
  }

  @UseGuards(JwtAuthGuard)
  @Get("detail/:sid")
  getDetail(@Param("sid", ParseIntPipe) sid: number) {
    return this.service.getDetail(sid);
  }
}
