import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DiaryService } from "./diary.service.js";
import { CurrentUser } from "../decorators/current-user.decorator.js";
import { CreateRecordDto } from "./dto/create-record.dto.js";
import { UpdateRecordDto } from "./dto/update-record.dto.js";

@Controller('diary')
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
    return this.diary.create(dto.targetDate, dto.content, user.id);
  }

  @Patch(':targetDate')
  update(@Param('targetDate') targetDate: string, @Body() dto: UpdateRecordDto, @CurrentUser() user: { id: string }) {
    return this.diary.create(targetDate, dto.content, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.diary.remove(id, user.id);
  }
}