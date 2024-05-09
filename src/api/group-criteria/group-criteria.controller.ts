import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { GroupCriteriaService } from "./group-criteria.service";

@Controller("group-criteria")
export class GroupCriteriaController {
  constructor(private groupCriteriaService: GroupCriteriaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getList() {
    return this.groupCriteriaService.getList();
  }
}
