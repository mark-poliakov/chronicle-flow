import { Module } from '@nestjs/common';
import { AppLogger } from './app-logger.service.js';
import { RequestContextService } from './request-context.js';

@Module({
  providers: [AppLogger, RequestContextService],
  exports: [AppLogger, RequestContextService],
})
export class AppLoggerModule {}
