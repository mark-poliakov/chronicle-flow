import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { UpdateRecordDto } from "./dto/update-record.dto.js";
import { CreateRecordDto } from "./dto/create-record.dto.js";

@Injectable()
export class DiaryService {
  constructor (private prisma: PrismaService) {}

  findAllEntries(userId: string) {
    return this.prisma.entry.findMany({
      where: { userId },
      orderBy: { targetDate: 'desc' },
    });
  }

  findAllEntryRevisions(targetDate: string, userId: string) {
    targetDate = new Date(targetDate).toISOString();
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
    const date = new Date(dto.targetDate).toISOString();
    const entry = await this.prisma.entry.findFirst({ where: { userId, targetDate: date }})
    let entryId;
    if (!entry) {
      entryId = (await this.prisma.entry.create({ data: { userId, targetDate: date } })).id;
    } else {
      entryId = entry!.id;
    }

    return this.prisma.entryRevision.create({ data: { content: dto.content, entryId } });
  }

  async update(id: string, dto: UpdateRecordDto, userId: string) {
    const entryRevision = await this.prisma.entryRevision.findUnique({
      where: {
        id,
        entry: {
          userId,
        },
      },
    });
    if (!entryRevision) {
      throw new NotFoundException(`EntryRevision ${id} not found`);
    }
    return this.prisma.entryRevision.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    const entryRevision = await this.prisma.entryRevision.findUnique({
      where: {
        id,
        entry: {
          userId,
        },
      },
    });
    if (!entryRevision) {
      throw new NotFoundException(`EntryRevision ${id} not found`);
    }
    return this.prisma.entryRevision.delete({ where: { id } });
  }
}