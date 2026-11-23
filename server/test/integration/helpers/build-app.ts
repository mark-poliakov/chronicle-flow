import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DiaryController } from '../../../src/diary/diary.controller.js';
import { DiaryService } from '../../../src/diary/diary.service.js';
import { PrismaService } from '../../../src/prisma/prisma.service.js';
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard.js';
import { ConfigService } from '@nestjs/config';
import { AppLoggerModule } from '../../../src/logger/app-logger.module.js';

export function makeFakeGuard(user: { id: string } | null) {
  return {
    canActivate: (ctx: any) => {
      if (!user) throw new Error('Unauthorized');
      ctx.switchToHttp().getRequest().user = user;
      return true;
    },
  };
}

export async function buildDiaryApp(user: { id: string } | null): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    controllers: [DiaryController],
    providers: [DiaryService, PrismaService, ConfigService],
    imports: [AppLoggerModule],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue(makeFakeGuard(user))
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}
