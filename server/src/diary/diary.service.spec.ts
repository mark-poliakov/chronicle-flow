import { Test } from '@nestjs/testing';
import { DiaryService } from './diary.service.js';
import { NotFoundException } from '@nestjs/common';
import { AppLoggerModule } from '../logger/app-logger.module.js';
import { DiaryRepository } from './diary.repository.js';
import { AppLogger } from '../logger/app-logger.service.js';

const normalizeDate = (targetDate: string) => {
  const date = new Date(targetDate);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

describe('DiaryService', () => {
  let service: DiaryService;
  let logger: {
    log: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    debug: ReturnType<typeof vi.fn>;
    verbose: ReturnType<typeof vi.fn>;
  };
  let diary: {
    findEntriesByUser: ReturnType<typeof vi.fn>;
    findRecordsByDate: ReturnType<typeof vi.fn>;
    findEntryByDate: ReturnType<typeof vi.fn>;
    findRecordOwnedByUser: ReturnType<typeof vi.fn>;
    createEntry: ReturnType<typeof vi.fn>;
    createRecord: ReturnType<typeof vi.fn>;
    updateRecord: ReturnType<typeof vi.fn>;
    deleteRecord: ReturnType<typeof vi.fn>;
    transaction: (fn: (tx: typeof diary) => ReturnType<typeof vi.fn>) => ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    logger = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      verbose: vi.fn(),
    };
    diary = {
      findEntriesByUser: vi.fn(),
      findRecordsByDate: vi.fn(),
      findEntryByDate: vi.fn(),
      findRecordOwnedByUser: vi.fn(),
      createEntry: vi.fn(),
      createRecord: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecord: vi.fn(),
      transaction: (
        fn: (tx: typeof diary) => ReturnType<typeof vi.fn>,
      ): ReturnType<typeof vi.fn> => {
        return fn(diary);
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [DiaryService, { provide: DiaryRepository, useValue: diary }],
      imports: [AppLoggerModule],
    })
      .overrideProvider(AppLogger)
      .useValue(logger)
      .compile();

    service = moduleRef.get(DiaryService);
  });

  describe('findAllEntries', () => {
    it('queries entries of only the given user, newest first', async () => {
      const rows = [{ id: 'e1' }, { id: 'e2' }];
      diary.findEntriesByUser.mockResolvedValue(rows);

      const result = await service.findAllEntries('user-1');

      expect(diary.findEntriesByUser).toHaveBeenCalledWith('user-1', expect.anything());
      expect(result).toBe(rows);
    });
  });

  describe('findAllEntryRevisions', () => {
    it('normalises the target date before querying', async () => {
      diary.findRecordsByDate.mockResolvedValue([]);
      const targetDate = '2025-01-15T10:30:15.500Z';
      const expectedDate = normalizeDate(targetDate);
      await service.findAllEntryRevisions(targetDate, 'user-1');
      expect(diary.findRecordsByDate).toHaveBeenCalledWith(
        'user-1',
        expectedDate,
        expect.anything(),
      );
    });

    it('queries entry revisions of only the given user, oldest first', async () => {
      const targetDate = '2025-01-15';
      const user = 'user-1';
      diary.findRecordsByDate.mockResolvedValue([]);

      await service.findAllEntryRevisions(targetDate, user);

      const expectedDate = normalizeDate(targetDate);
      expect(diary.findRecordsByDate).toHaveBeenCalledWith(user, expectedDate, 'asc');
    });
  });

  describe('create', () => {
    const user = 'user-1';
    const targetDate = '2025-01-15';
    const content = 'hello';
    const dto = { targetDate, content };

    it('creates new entry when target day is empty', async () => {
      diary.findEntryByDate.mockResolvedValue(null);
      diary.createEntry.mockResolvedValue({ id: 'entry-new' });
      diary.createRecord.mockResolvedValue({ id: 'rev-new', content: content });

      const result = await service.create(dto, user);

      const expectedDate = normalizeDate(targetDate);
      expect(diary.findEntryByDate).toHaveBeenCalledWith(user, expectedDate);
      expect(diary.createEntry).toHaveBeenCalledWith(user, expectedDate);
      expect(diary.createRecord).toHaveBeenCalledWith('entry-new', content);
      expect(result).toEqual({ id: 'rev-new', content });
    });

    it('reuses existing entry when one already exists for that day', async () => {
      diary.findEntryByDate.mockResolvedValue({ id: 'entry-existing' });
      diary.createRecord.mockResolvedValue({ id: 'rev-new', content: content });

      const result = await service.create(dto, 'user-1');

      const expectedDate = normalizeDate(dto.targetDate);
      expect(diary.findEntryByDate).toHaveBeenCalledWith(user, expectedDate);
      expect(diary.createEntry).not.toHaveBeenCalled();
      expect(diary.createRecord).toHaveBeenCalledWith('entry-existing', 'hello');
      expect(result).toEqual({ id: 'rev-new', content });
    });
  });

  describe('update', () => {
    it('throws NotFoundException when revision does not exist or belongs to another user', async () => {
      diary.findRecordOwnedByUser.mockResolvedValue(null);

      await expect(service.update('rev-x', { content: 'new' }, 'user-1')).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(diary.updateRecord).not.toHaveBeenCalled();
    });
    it('updates and returns a revision', async () => {
      const revisionId = 'rev-existing';
      const content = 'edited';
      const dto = { content };
      diary.findRecordOwnedByUser.mockResolvedValue({ id: revisionId });
      diary.updateRecord.mockResolvedValue({ id: revisionId });

      const result = await service.update(revisionId, dto, 'user-1');
      expect(diary.findRecordOwnedByUser).toHaveBeenCalledWith('user-1', revisionId);
      expect(diary.updateRecord).toHaveBeenCalledWith(revisionId, dto);
      expect(result).toEqual({ id: revisionId });
    });
  });
  describe('remove', () => {
    it('throws NotFoundException when revision does not exist or belongs to another user', async () => {
      diary.findRecordOwnedByUser.mockResolvedValue(null);

      await expect(service.remove('rev-x', 'user-1')).rejects.toBeInstanceOf(NotFoundException);

      expect(diary.deleteRecord).not.toHaveBeenCalled();
    });
    it('removes existing revision', async () => {
      const revisionId = 'rev-existing';
      diary.findRecordOwnedByUser.mockResolvedValue({ id: revisionId });

      await service.remove(revisionId, 'user-1');
      expect(diary.findRecordOwnedByUser).toHaveBeenCalled();
      expect(diary.deleteRecord).toHaveBeenCalledWith(revisionId);
    });
  });
});
