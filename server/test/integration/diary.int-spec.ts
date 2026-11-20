import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service.js';
import { buildDiaryApp } from './helpers/build-app.js';
import request from 'supertest';
import { seedEntryRevision } from './helpers/factories.js';

const USER_A = 'user-a';
const USER_B = 'user-b';
const INFO_USER_A = { id: USER_A, email: 'a@example.com', password: 'hash' };

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
    await prisma.user.create({ data: INFO_USER_A });

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
    const entryRevisionId = await seedEntryRevision(prisma, {
      userId: USER_A,
      content: 'original',
      targetDate: '2025-01-15',
    });

    const res = await request(app.getHttpServer())
      .patch(`/diary/${entryRevisionId}`)
      .send({ content: 'edited' })
      .expect(200);

    expect(res.body).toMatchObject({ id: entryRevisionId, content: 'edited' });

    const stored = await prisma.entryRevision.findUnique({ where: { id: entryRevisionId } });
    expect(stored?.content).toBe('edited');
  });

  it('Multiple POSTs on the same day create an entry only once in the DB', async () => {
    await prisma.user.create({ data: INFO_USER_A });

    await request(app.getHttpServer())
      .post('/diary')
      .send({ targetDate: '2025-01-15', content: 'hello' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/diary')
      .send({ targetDate: '2025-01-15', content: 'hello2' })
      .expect(201);

    expect(await prisma.entry.count()).toBe(1);
    expect(await prisma.entryRevision.count()).toBe(2);
  });

  it('POSTs on different days create multiple entries in the DB', async () => {
    await prisma.user.create({ data: INFO_USER_A });

    await request(app.getHttpServer())
      .post('/diary')
      .send({ targetDate: '2025-01-15', content: 'hello' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/diary')
      .send({ targetDate: '2025-05-15', content: 'hello' })
      .expect(201);

    expect(await prisma.entry.count()).toBe(2);
    expect(await prisma.entryRevision.count()).toBe(2);
  });

  it('POST with time component in date stores truncated date in the DB', async () => {
    await prisma.user.create({ data: INFO_USER_A });

    await request(app.getHttpServer())
      .post('/diary')
      .send({ targetDate: '2025-01-15T12:30:15Z', content: 'hello' })
      .expect(201);

    const entry = await request(app.getHttpServer()).get('/diary/entries').expect(200);
    expect(entry.body).toHaveLength(1);
    expect(entry.body[0]).toMatchObject({ targetDate: '2025-01-15T00:00:00.000Z' });

    const entryInDB = await prisma.entry.findMany();
    expect(entryInDB).toHaveLength(1);
    expect(entryInDB[0].targetDate.toISOString()).toBe('2025-01-15T00:00:00.000Z');
  });

  it('PATCH of non-existent entryRevision does not change any row in the DB', async () => {
    await prisma.user.create({ data: INFO_USER_A });

    await request(app.getHttpServer())
      .patch('/diary/non-existent')
      .send({ content: 'updated' })
      .expect(404);

    expect(await prisma.entry.count()).toBe(0);
    expect(await prisma.entryRevision.count()).toBe(0);
  });

  it('DELETE /diary/:id actually deletes the record from the DB', async () => {
    const entryRevisionId = await seedEntryRevision(prisma, { userId: USER_A });

    await request(app.getHttpServer()).delete(`/diary/${entryRevisionId}`).expect(200);

    expect(await prisma.entryRevision.findUnique({ where: { id: entryRevisionId } })).toBeNull();
  });

  it('User isolation is present at the DB level', async () => {
    const initialContent = 'record of user-b';
    const entryRevisionId = await seedEntryRevision(prisma, {
      userId: USER_B,
      content: initialContent,
    });

    await request(app.getHttpServer())
      .patch(`/diary/${entryRevisionId}`)
      .send({ content: 'updated by user-a' })
      .expect(404);

    expect(await prisma.entryRevision.findUnique({ where: { id: entryRevisionId } })).toMatchObject(
      { content: initialContent },
    );
  });

  it("GET /diary/entries only returns the current user's entries", async () => {
    await seedEntryRevision(prisma, { userId: USER_A, content: 'content user-a' });
    await seedEntryRevision(prisma, { userId: USER_B, content: 'content user-b' });

    const resultForA = await request(app.getHttpServer()).get('/diary/entries').expect(200);
    expect(resultForA.body).toHaveLength(1);
    expect(resultForA.body[0].userId).toBe(USER_A);

    expect(await prisma.entry.findMany()).toHaveLength(2);
  });
});
