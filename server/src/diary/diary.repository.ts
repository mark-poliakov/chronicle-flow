import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SortOrder } from '../generated/prisma/internal/prismaNamespace.js';

@Injectable()
export class DiaryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findEntriesByUser(userId: string, order: SortOrder) {
    return this.prisma.entry.findMany({
      where: { userId },
      orderBy: { targetDate: order },
    });
  }
  findRecordsByDate(userId: string, targetDate: string, order: SortOrder) {
    return this.prisma.entryRevision.findMany({
      where: { entry: { targetDate, userId } },
      orderBy: { createdAt: order },
    });
  }
  findEntryByDate(userId: string, targetDate: string) {
    return this.prisma.entry.findFirst({ where: { userId, targetDate } });
  }
  findRecordOwnedByUser(userId: string, id: string) {
    return this.prisma.entryRevision.findUnique({
      where: { id, entry: { userId } },
    });
  }
  createEntry(userId: string, targetDate: string) {
    return this.prisma.entry.create({ data: { userId, targetDate } });
  }
  createRecord(entryId: string, content: string) {
    return this.prisma.entryRevision.create({ data: { entryId, content } });
  }
  updateRecord(id: string, data: { content: string }) {
    return this.prisma.entryRevision.update({ where: { id }, data });
  }
  deleteRecord(id: string) {
    return this.prisma.entryRevision.delete({ where: { id } });
  }
  findRecordsByEntryId(entryId: string) {
    return this.prisma.entryRevision.findMany({ where: { entryId } });
  }
  deleteEntry(id: string) {
    return this.prisma.entry.delete({ where: { id } });
  }

  transaction<T>(fn: (tx: DiaryRepository) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((prismaTx) => {
      const repo = new DiaryRepository(prismaTx as PrismaService);
      return fn(repo);
    });
  }
}
