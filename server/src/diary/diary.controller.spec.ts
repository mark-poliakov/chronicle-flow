import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DiaryController } from './diary.controller.js';
import { DiaryService } from './diary.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import request from 'supertest';

function makeFakeGuard(user: { id: string } | null) {
  return {
    canActivate: (ctx: any) => {
      if (!user) return false;
      ctx.switchToHttp().getRequest().user = user;
      return true;
    },
  };
}

describe('DiaryController (module test)', () => {
  let app: INestApplication;
  let diary: {
    findAllEntries: ReturnType<typeof vi.fn>;
    findAllEntryRevisions: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  async function boot(user: { id: string } | null) {
    diary = {
      findAllEntries: vi.fn(),
      findAllEntryRevisions: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [DiaryController],
      providers: [{ provide: DiaryService, useValue: diary }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(makeFakeGuard(user))
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    return app;
  }

  afterEach(async () => {
    await app?.close();
  });

  it.each([
    ['get', '/diary/entries'],
    ['patch', '/diary/record-existing'],
    ['delete', '/diary/record-existing'],
    ['post', '/diary'],
  ])('%s %s is guarded', async (verb, path) => {
    await boot(null);
    await (request(app.getHttpServer()) as any)[verb](path).expect(403);
    expect(Object.values(diary).every((fn) => fn.mock.calls.length === 0)).toBe(true);
  });

  it('GET /diary/entries: returns entries of the authenticated user', async () => {
    await boot({ id: 'user-1' });
    diary.findAllEntries.mockResolvedValue([{ id: 'e1', targetDate: '2025-01-15' }]);

    const result = await request(app.getHttpServer()).get('/diary/entries').expect(200);

    expect(diary.findAllEntries).toHaveBeenCalledWith('user-1');
    expect(result.body).toEqual([{ id: 'e1', targetDate: '2025-01-15' }]);
  });

  it('POST /diary: forwards dto and current user id to DiaryService.create', async () => {
    await boot({ id: 'user-1' });
    diary.create.mockResolvedValue({ id: 'rev-1', content: 'hi' });

    const body = { targetDate: '2025-01-15', content: 'hi' };

    await request(app.getHttpServer()).post('/diary').send(body).expect(201);

    expect(diary.create).toHaveBeenCalledWith(body, 'user-1');
  });

  it('GET /diary/records/:targetDate: params remain untouched', async () => {
    const userId = 'user-1';
    await boot({ id: userId });
    const records = [{ id: 'r1' }, { id: 'r2' }];
    diary.findAllEntryRevisions.mockResolvedValue(records);
    const targetDate = '2025-01-15';

    const result = await request(app.getHttpServer())
      .get(`/diary/records/${targetDate}`)
      .expect(200);

    expect(diary.findAllEntryRevisions).toHaveBeenCalledWith(targetDate, userId);
    expect(result.body).toEqual(records);
  });

  describe('PATCH /diary/:id', () => {
    it('calls DiaryService.update', async () => {
      const userId = 'user-1';
      await boot({ id: userId });
      const recordId = 'record';
      const dto = { content: 'updated' };

      await request(app.getHttpServer()).patch(`/diary/${recordId}`).send(dto).expect(200);

      expect(diary.update).toHaveBeenCalledWith(recordId, dto, userId);
    });

    it('returns 404 when the service throws NotFoundException', async () => {
      await boot({ id: 'user-1' });
      diary.update.mockRejectedValue(new NotFoundException('EntryRevision not found'));

      await request(app.getHttpServer()).patch('/diary/missing').send({ content: 'x' }).expect(404);
    });
  });

  describe('DELETE /diary/:id', () => {
    it('calls DiaryService.remove', async () => {
      const userId = 'user-1';
      await boot({ id: userId });
      const recordId = 'record';

      await request(app.getHttpServer()).delete(`/diary/${recordId}`).expect(200);

      expect(diary.remove).toHaveBeenCalledWith(recordId, userId);
    });

    it('returns 404 when the service throws NotFoundException', async () => {
      await boot({ id: 'user-1' });
      diary.remove.mockRejectedValue(new NotFoundException('EntryRevision not found'));

      await request(app.getHttpServer()).delete('/diary/missing').expect(404);
    });
  });
});
