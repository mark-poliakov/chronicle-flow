import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service.js';
import { buildE2EApp } from './helpers/build-app.js';
import { registerAndLogin } from './helpers/auth.js';
import request from 'supertest';

describe('Diary (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await buildE2EApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('a freshly registered use can create a diary record with a real JWT', async () => {
    const { accessToken } = await registerAndLogin(app, 'user1@example.com');

    const res = await request(app.getHttpServer())
      .post('/diary')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ targetDate: '2025-01-15', content: 'first record' })
      .expect(201);

    expect(res.body).toMatchObject({ content: 'first record' });

    const revisions = await prisma.entryRevision.findMany({
      where: { content: 'first record' },
    });
    expect(revisions).toHaveLength(1);
  });

  it('user journey: register, create, list, edit, delete', async () => {
    const { accessToken, userId } = await registerAndLogin(app, 'user2@example.com');
    const auth = `Bearer ${accessToken}`;

    const created = await request(app.getHttpServer())
      .post('/diary')
      .set('Authorization', auth)
      .send({ targetDate: '2025-01-15', content: 'draft' })
      .expect(201);
    const entryRevisionId = created.body.id;

    const list = await request(app.getHttpServer())
      .get('/diary/entries')
      .set('Authorization', auth)
      .expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].userId).toBe(userId);

    await request(app.getHttpServer())
      .patch(`/diary/${entryRevisionId}`)
      .set('Authorization', auth)
      .send({ content: 'final' })
      .expect(200);

    const afterEdit = await prisma.entryRevision.findUnique({ where: { id: entryRevisionId } });
    expect(afterEdit?.content).toBe('final');

    await request(app.getHttpServer())
      .delete(`/diary/${entryRevisionId}`)
      .set('Authorization', auth)
      .expect(200);

    const afterDelete = await prisma.entryRevision.findUnique({ where: { id: entryRevisionId } });
    expect(afterDelete).toBeNull();
  });

  it('access denied when token is invalid', async () => {
    await request(app.getHttpServer()).get('/diary/entries').expect(401);

    await request(app.getHttpServer())
      .get('/diary/entries')
      .set('Authorization', 'not-real-jwt')
      .expect(401);

    await request(app.getHttpServer())
      .post('/diary')
      .send({ targetDate: '2025-01-15', content: 'illegal record hehehe' })
      .expect(401);

    await request(app.getHttpServer())
      .post('/diary')
      .set('Authorization', 'not-real-jwt')
      .send({ targetDate: '2025-01-15', content: 'illegal record hehehe' })
      .expect(401);
  });

  it('users are isolated', async () => {
    const { accessToken: tokenA, userId: userAId } = await registerAndLogin(
      app,
      'user-a@example.com',
    );
    const { accessToken: tokenB, userId: userBId } = await registerAndLogin(
      app,
      'user-b@example.com',
    );
    const authA = `Bearer ${tokenA}`;
    const authB = `Bearer ${tokenB}`;

    const createdRecord = await request(app.getHttpServer())
      .post('/diary')
      .set('Authorization', authA)
      .send({ targetDate: '2025-01-15', content: 'record from A' })
      .expect(201);

    await request(app.getHttpServer())
      .get('/diary/entries')
      .set('Authorization', authB)
      .expect(200)
      .expect([]);

    await request(app.getHttpServer())
      .patch(`/diary/${createdRecord.body.id}`)
      .set('Authorization', authB)
      .send({ content: 'updated by B' })
      .expect(404);

    const entriesA = await prisma.entry.findMany({ where: { userId: userAId } });
    expect(entriesA).toHaveLength(1);
    expect(await prisma.entry.findMany({ where: { userId: userBId } })).toHaveLength(0);

    const entryRevisionsA = await prisma.entryRevision.findMany({
      where: { entryId: entriesA[0].id },
    });
    expect(entryRevisionsA).toHaveLength(1);
    expect(entryRevisionsA[0]).toMatchObject({ content: 'record from A' });
  });
});
