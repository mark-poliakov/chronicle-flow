import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service.js';
import { buildDiaryApp } from './helpers/build-app.js';
import request from 'supertest';

const USER_A = 'user-a';
// const USER_B = 'user-b';

describe('Diary (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    app = await buildDiaryApp({ id: USER_A });
    prisma = app.get(PrismaService);

    await prisma.entryRevision.deleteMany();
    await prisma.entry.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /diary then GET /diary/entries round-trips through SQLite', async () => {
    await prisma.user.create({
      data: { id: USER_A, email: 'a@example.com', password: 'hash' },
    });

    const createRes = await request(app.getHttpServer())
      .post('/diary')
      .send({ targetDate: '2025-01-15', content: 'hello' })
      .expect(201);

    expect(createRes.body).toMatchObject({ content: 'hello' });

    const entries = await prisma.entry.findMany({ where: { userId: USER_A } });
    expect(entries).toHaveLength(1);
    expect(entries[0].targetDate.toISOString()).toBe('2025-01-15T00:00:00.000Z');

    const revisions = await prisma.entryRevision.findMany({
      where: { entryId: entries[0].id },
    });
    expect(revisions).toHaveLength(1);
    expect(revisions[0].content).toBe('hello');

    const listRes = await request(app.getHttpServer()).get('/diary/entries').expect(200);

    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(entries[0].id);
  });

  it('PATCH /diary/:id actually updates the revision in the DB', async () => {
    await prisma.user.create({
      data: { id: USER_A, email: 'a@example.com', password: 'hash' },
    });
    const entry = await prisma.entry.create({
      data: { userId: USER_A, targetDate: new Date('2025-01-15').toISOString() },
    });
    const revision = await prisma.entryRevision.create({
      data: { entryId: entry.id, content: 'original' },
    });

    const res = await request(app.getHttpServer())
      .patch(`/diary/${revision.id}`)
      .send({ content: 'edited' })
      .expect(200);

    expect(res.body).toMatchObject({ id: revision.id, content: 'edited' });

    const stored = await prisma.entryRevision.findUnique({ where: { id: revision.id } });
    expect(stored?.content).toBe('edited');
  });
});
