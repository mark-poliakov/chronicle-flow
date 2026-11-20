import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { GLOBAL_PREFIX } from '../../../src/app.constants.js';

const API = `/${GLOBAL_PREFIX}`;

export async function registerAndLogin(
  app: INestApplication,
  email: string,
  password: string = 'password123',
): Promise<{ accessToken: string; userId: string }> {
  const token = await request(app.getHttpServer())
    .post(`${API}/auth/register`)
    .send({ email, password })
    .expect(201);

  const userInfo = await request(app.getHttpServer())
    .get(`${API}/auth/me`)
    .set('Authorization', `Bearer ${token.body.accessToken}`)
    .expect(200);

  return { accessToken: token.body.accessToken, userId: userInfo.body.id };
}
