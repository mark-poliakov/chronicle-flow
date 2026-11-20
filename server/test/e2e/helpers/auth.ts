import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export async function registerAndLogin(
  app: INestApplication,
  email: string,
  password: string = 'password123',
): Promise<{ accessToken: string; userId: string }> {
  const token = await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password })
    .expect(201);

  const userInfo = await request(app.getHttpServer())
    .get('/auth/me')
    .set('Authorization', `Bearer ${token.body.accessToken}`)
    .expect(200);

  return { accessToken: token.body.accessToken, userId: userInfo.body.id };
}
