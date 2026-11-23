import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller.js';
import { DiaryService } from './diary.service.js';
import { AppLoggerModule } from '../logger/app-logger.module.js';

@Module({
  controllers: [DiaryController],
  providers: [DiaryService],
  imports: [AppLoggerModule],
})
export class DiaryModule {}
