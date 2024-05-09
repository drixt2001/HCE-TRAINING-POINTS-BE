import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { ClassService } from "./class.service";

@Controller("class")
@UseGuards(JwtAuthGuard)
export class ClassController {
  constructor(private classService: ClassService) {}
  @Get()
  getList() {
    return this.classService.getList();
  }

  @Get(":teacher_id")
  getClassTeacher(@Param("teacher_id", ParseIntPipe) tid: number) {
    return this.classService.getClassOfTeacher(tid);
  }
}
