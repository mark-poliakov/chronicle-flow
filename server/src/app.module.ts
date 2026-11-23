import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { DiaryModule } from './diary/diary.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RequestContextMiddleware } from './logger/request-context.middleware.js';
import { AppLoggerModule } from './logger/app-logger.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    DiaryModule,
    AuthModule,
    AppLoggerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
