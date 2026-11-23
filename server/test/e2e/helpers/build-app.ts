import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module.js';
import { GLOBAL_PREFIX } from '../../../src/app.constants.js';
import { PrismaExceptionFilter } from '../../../src/common/filters/prisma-exception.filter.js';
import { AppLogger } from '../../../src/logger/app-logger.service.js';

export async function buildE2EApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  app.useLogger(app.get(AppLogger));
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.init();
  return app;
}
