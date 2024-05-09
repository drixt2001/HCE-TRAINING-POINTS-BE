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
import { CreateNoti } from "./dto/create";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getList() {
    return this.service.getList();
  }

  @Get("public")
  getListView() {
    return this.service.getListView();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateNoti) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(@Body() dto: CreateNoti, @Param("id", ParseIntPipe) id: number) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
