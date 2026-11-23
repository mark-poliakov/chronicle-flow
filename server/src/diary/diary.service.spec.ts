import { Test } from '@nestjs/testing';
import { DiaryService } from './diary.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotFoundException } from '@nestjs/common';
import { AppLoggerModule } from '../logger/app-logger.module.js';

const normalizeDate = (targetDate: string) => {
  const date = new Date(targetDate);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date.toISOString();
};

describe('DiaryService', () => {
  let service: DiaryService;
  let prisma: {
    entry: {
      findMany: ReturnType<typeof vi.fn>;
      findFirst: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
    };
    entryRevision: {
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    prisma = {
      entry: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
      entryRevision: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [DiaryService, { provide: PrismaService, useValue: prisma }],
      imports: [AppLoggerModule],
    }).compile();

    service = moduleRef.get(DiaryService);
  });

  describe('findAllEntries', () => {
    it('queries entries of only the given user, newest first', async () => {
      const rows = [{ id: 'e1' }, { id: 'e2' }];
      prisma.entry.findMany.mockResolvedValue(rows);

      const result = await service.findAllEntries('user-1');

      expect(prisma.entry.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { targetDate: 'desc' },
      });
      expect(result).toBe(rows);
    });
  });

  describe('findAllEntryRevisions', () => {
    it('normalises the target date before querying', async () => {
      prisma.entryRevision.findMany.mockResolvedValue([]);
      const targetDate = '2025-01-15T10:30:15.500Z';
      const expectedDate = normalizeDate(targetDate);
      await service.findAllEntryRevisions(targetDate, 'user-1');
      expect(prisma.entryRevision.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            entry: expect.objectContaining({ targetDate: expectedDate }),
          }),
        }),
      );
    });

    it('queries entry revisions of only the given user, oldest first', async () => {
      const targetDate = '2025-01-15';
      const user = 'user-1';
      prisma.entryRevision.findMany.mockResolvedValue([]);

      await service.findAllEntryRevisions(targetDate, user);

      const expectedDate = normalizeDate(targetDate);
      expect(prisma.entryRevision.findMany).toHaveBeenCalledWith({
        where: {
          entry: {
            targetDate: expectedDate,
            userId: user,
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('create', () => {
    const user = 'user-1';
    const targetDate = '2025-01-15';
    const content = 'hello';
    const dto = { targetDate, content };

    it('creates new entry when target day is empty', async () => {
      prisma.entry.findFirst.mockResolvedValue(null);
      prisma.entry.create.mockResolvedValue({ id: 'entry-new' });
      prisma.entryRevision.create.mockResolvedValue({ id: 'rev-new' });

      const result = await service.create(dto, user);

      const expectedDate = normalizeDate(targetDate);
      expect(prisma.entry.findFirst).toHaveBeenCalledWith({
        where: { userId: user, targetDate: expectedDate },
      });
      expect(prisma.entry.create).toHaveBeenCalledWith({
        data: { userId: user, targetDate: expectedDate },
      });
      expect(prisma.entryRevision.create).toHaveBeenCalledWith({
        data: { content, entryId: 'entry-new' },
      });
      expect(result).toEqual({ id: 'rev-new' });
    });
    it('reuses existing entry when one already exists for that day', async () => {
      prisma.entry.findFirst.mockResolvedValue({ id: 'entry-existing' });
      prisma.entryRevision.create.mockResolvedValue({ id: 'rev-new' });

      const dto = { targetDate: '2025-01-15', content: 'hello' };
      const result = await service.create(dto, 'user-1');

      const expectedDate = normalizeDate(dto.targetDate);
      expect(prisma.entry.findFirst).toHaveBeenCalledWith({
        where: { userId: 'user-1', targetDate: expectedDate },
      });
      expect(prisma.entry.create).not.toHaveBeenCalled();
      expect(prisma.entryRevision.create).toHaveBeenCalledWith({
        data: { content: 'hello', entryId: 'entry-existing' },
      });
      expect(result).toEqual({ id: 'rev-new' });
    });
  });

  describe('update', () => {
    it('throws NotFoundException when revision does not exist or belongs to another user', async () => {
      prisma.entryRevision.findUnique.mockResolvedValue(null);

      await expect(service.update('rev-x', { content: 'new' }, 'user-1')).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(prisma.entryRevision.update).not.toHaveBeenCalled();
    });
    it('updates and returns a revision', async () => {
      const revisionId = 'rev-existing';
      const content = 'edited';
      const dto = { content };
      prisma.entryRevision.findUnique.mockResolvedValue({ id: revisionId });
      prisma.entryRevision.update.mockResolvedValue({ id: revisionId });

      const result = await service.update(revisionId, dto, 'user-1');
      expect(prisma.entryRevision.findUnique).toHaveBeenCalledWith({
        where: {
          id: revisionId,
          entry: { userId: 'user-1' },
        },
      });
      expect(prisma.entryRevision.update).toHaveBeenCalledWith({
        where: { id: revisionId },
        data: dto,
      });
      expect(result).toEqual({ id: revisionId });
    });
  });
  describe('remove', () => {
    it('throws NotFoundException when revision does not exist or belongs to another user', async () => {
      prisma.entryRevision.findUnique.mockResolvedValue(null);

      await expect(service.remove('rev-x', 'user-1')).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.entryRevision.delete).not.toHaveBeenCalled();
    });
    it('removes existing revision', async () => {
      const revisionId = 'rev-existing';
      prisma.entryRevision.findUnique.mockResolvedValue({ id: revisionId });

      await service.remove(revisionId, 'user-1');
      expect(prisma.entryRevision.findUnique).toHaveBeenCalled();
      expect(prisma.entryRevision.delete).toHaveBeenCalledWith({
        where: { id: revisionId },
      });
    });
  });
});
