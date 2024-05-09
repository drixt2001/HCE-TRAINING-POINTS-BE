import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CriteriaService } from "./criteria.service";

@Controller("criteria")
export class CriteriaController {
  constructor(private criteriaService: CriteriaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getList() {
    return this.criteriaService.getList();
  }

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(@Body() dto: any) {
  //   return this.criteriaService.create(dto);
  // }
}
