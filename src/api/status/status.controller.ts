import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { StatusService } from "./status.service";

@Controller("status")
export class StatusController {
  constructor(private statusService: StatusService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getList() {
    return this.statusService.getList();
  }
}
