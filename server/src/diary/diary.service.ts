import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { Entry, EntryRevision } from "../generated/prisma/client.js";

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
    return this.prisma.entryRevision.findMany({
      where: {
        entry: {
          where: { targetDate }
        },
        userId
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(targetDate: string, content: string, userId: string) {
    const date = new Date(targetDate);
    const entry = await this.prisma.entry.findFirst({ where: { userId, targetDate: date }})
    let entryId;
    if (!entry) {
      entryId = (await this.prisma.entry.create({ data: { userId, targetDate } })).id;
    } else {
      entryId = entry!.id;
    }

    return this.prisma.entryRevision.create({ data: { content, entryId } });
  }

  async update(id: string, data: { content: string }, userId: string) {
    const entryRevision = await this.prisma.entryRevision.findUnique({
      where: {
        id,
        entry: {
          where: { userId },
        },
      },
    });
    if (!entryRevision) {
      throw new NotFoundException(`EntryRevision ${id} not found`);
    }
    return this.prisma.entryRevision.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    const entryRevision = await this.prisma.entryRevision.findUnique({
      where: {
        id,
        entry: {
          where: { userId },
        },
      },
    });
    if (!entryRevision) {
      throw new NotFoundException(`EntryRevision ${id} not found`);
    }
    return this.prisma.entryRevision.delete({ where: { id } });
  }
}