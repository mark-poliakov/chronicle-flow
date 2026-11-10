import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { DiaryService } from "./diary.service.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { CreateRecordDto } from "./dto/create-record.dto.js";
import { UpdateRecordDto } from "./dto/update-record.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor (private diary: DiaryService) {}

  @Get('entries')
  findAllEntries(@CurrentUser() user: { id: string }) {
    return this.diary.findAllEntries(user.id);
  }

  @Get('records/:targetDate')
  findAllEntryRevisions(@Param('targetDate') targetDate: string, @CurrentUser() user: { id: string }) {
    return this.diary.findAllEntryRevisions(targetDate, user.id)
  }

  @Post()
  create(@Body() dto: CreateRecordDto, @CurrentUser() user: { id: string }) {
    return this.diary.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecordDto, @CurrentUser() user: { id: string }) {
    return this.diary.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.diary.remove(id, user.id);
  }
}