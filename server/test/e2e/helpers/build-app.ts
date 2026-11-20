import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module.js';
import { GLOBAL_PREFIX } from '../../../src/app.constants.js';

export async function buildE2EApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
}
