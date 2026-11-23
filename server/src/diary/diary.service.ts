import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRecordDto } from './dto/update-record.dto.js';
import { CreateRecordDto } from './dto/create-record.dto.js';
import { AppLogger } from '../logger/app-logger.service.js';
import { DiaryRepository } from './diary.repository.js';

@Injectable()
export class DiaryService {
  constructor(
    private readonly diary: DiaryRepository,
    private readonly logger: AppLogger,
  ) {}

  findAllEntries(userId: string) {
    this.logger.log(`find entries: user=${userId}`, DiaryService.name);
    return this.diary.findEntriesByUser(userId, 'desc');
  }

  findAllEntryRevisions(targetDate: string, userId: string) {
    const date = this.normalizeDate(targetDate);
    this.logger.log(`find records: user=${userId} date=${date}`, DiaryService.name);
    return this.diary.findRecordsByDate(userId, date, 'asc');
  }

  async create(dto: CreateRecordDto, userId: string) {
    const date = this.normalizeDate(dto.targetDate);
    this.logger.log(`create record: user=${userId} date=${date}`, DiaryService.name);

    const record = await this.diary.transaction(async (repo) => {
      let entry = await repo.findEntryByDate(userId, date);
      if (!entry) {
        entry = await repo.createEntry(userId, date);
        this.logger.log(`first record of the date -> creating an entry`, DiaryService.name);
      }
      return repo.createRecord(entry.id, dto.content);
    });

    this.logger.log(
      `record created: recordId=${record.id} contentLength=${record.content.length}`,
      DiaryService.name,
    );

    return record;
  }

  async update(id: string, dto: UpdateRecordDto, userId: string) {
    this.logger.log(`update record: user=${userId} record=${id}`, DiaryService.name);

    const record = await this.diary.findRecordOwnedByUser(userId, id);
    if (!record) {
      this.logger.warn(
        `record not found -> update nothing. check source of the request, this shouldn't have happened`,
        DiaryService.name,
      );
      throw new NotFoundException(`EntryRevision ${id} not found`);
    }
    return this.diary.updateRecord(id, dto);
  }

  async remove(id: string, userId: string) {
    this.logger.log(`delete record: user=${userId} record=${id}`, DiaryService.name);
    const record = await this.diary.findRecordOwnedByUser(userId, id);
    if (!record) {
      this.logger.warn(
        `record not found -> delete nothing. check source of the request, this shouldn't have happened`,
        DiaryService.name,
      );
      throw new NotFoundException(`EntryRevision ${id} not found`);
    }

    const entryId = record.entryId;
    return await this.diary.transaction(async (repo) => {
      const result = await repo.deleteRecord(id);
      if ((await repo.findRecordsByEntryId(entryId)).length === 0) {
        await repo.deleteEntry(entryId);
      }
      return result;
    });
  }

  private normalizeDate(targetDate: string) {
    const date = new Date(targetDate);
    date.setUTCHours(0, 0, 0, 0);
    if (date.getUTCFullYear() > 9999) {
      date.setUTCFullYear(9999);
    }
    if (date.getUTCFullYear() < 0) {
      date.setUTCFullYear(0);
    }
    return date.toISOString();
  }
}
