import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { StudentsService } from "./students.service";

@Controller("students")
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getInfoOne(@Param("id", ParseIntPipe) id: number) {
    return this.studentsService.getInfoForForm(id);
  }
}
