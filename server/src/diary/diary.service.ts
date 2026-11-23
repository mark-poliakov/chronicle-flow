import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateRecordDto } from './dto/update-record.dto.js';
import { CreateRecordDto } from './dto/create-record.dto.js';
import { AppLogger } from '../logger/app-logger.service.js';

@Injectable()
export class DiaryService {
  constructor(
    private prisma: PrismaService,
    private logger: AppLogger,
  ) {}

  findAllEntries(userId: string) {
    this.logger.log(`find entries: user=${userId}`, DiaryService.name);
    return this.prisma.entry.findMany({
      where: { userId },
      orderBy: { targetDate: 'desc' },
    });
  }

  findAllEntryRevisions(targetDate: string, userId: string) {
    this.logger.log(`find records: user=${userId} date=${targetDate}`, DiaryService.name);
    targetDate = this.normalizeDate(targetDate);
    return this.prisma.entryRevision.findMany({
      where: {
        entry: {
          targetDate,
          userId,
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(dto: CreateRecordDto, userId: string) {
    this.logger.log(`create record: user=${userId} date=${dto.targetDate}`, DiaryService.name);
    const date = this.normalizeDate(dto.targetDate);
    const entry = await this.prisma.entry.findFirst({ where: { userId, targetDate: date } });
    let entryId;
    if (!entry) {
      this.logger.log(`first record of the date, creating an entry`, DiaryService.name);
      entryId = (await this.prisma.entry.create({ data: { userId, targetDate: date } })).id;
    } else {
      entryId = entry!.id;
    }

    return this.prisma.entryRevision.create({ data: { content: dto.content, entryId } });
  }

  async update(id: string, dto: UpdateRecordDto, userId: string) {
    this.logger.log(`update record: user=${userId} record=${id}`, DiaryService.name);
    const entryRevision = await this.prisma.entryRevision.findUnique({
      where: {
        id,
        entry: {
          userId,
        },
      },
    });
    if (!entryRevision) {
      this.logger.warn(
        `record not found, update nothing, check source of the request`,
        DiaryService.name,
      );
      throw new NotFoundException(`EntryRevision ${id} not found`);
    }
    return this.prisma.entryRevision.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    this.logger.log(`delete record: user=${userId} record=${id}`, DiaryService.name);
    const entryRevision = await this.prisma.entryRevision.findUnique({
      where: {
        id,
        entry: {
          userId,
        },
      },
    });
    if (!entryRevision) {
      this.logger.warn(
        `record not found, delete nothing, check source of the request`,
        DiaryService.name,
      );
      throw new NotFoundException(`EntryRevision ${id} not found`);
    }
    return this.prisma.entryRevision.delete({ where: { id } });
  }

  private normalizeDate(targetDate: string) {
    const date = new Date(targetDate);
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date.toISOString();
  }
}
