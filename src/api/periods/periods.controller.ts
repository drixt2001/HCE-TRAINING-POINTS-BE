import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PeriodsService } from "./periods.service";

@Controller("periods")
export class PeriodsController {
  constructor(public service: PeriodsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getList() {
    return this.service.getList();
  }

  @UseGuards(JwtAuthGuard)
  @Get("now")
  getActive() {
    return this.service.activeNow();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(@Body() dto: any, @Param("id", ParseIntPipe) id: number) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
