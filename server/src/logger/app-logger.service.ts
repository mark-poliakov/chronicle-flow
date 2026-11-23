import { Injectable, LoggerService } from '@nestjs/common';
import { RequestContextService } from './request-context.js';

@Injectable()
export class AppLogger implements LoggerService {
  constructor(private readonly ctx: RequestContextService) {}

  private prefix(context?: string): string {
    const id = this.ctx.requestId ?? '-';
    return `[req=${id}]${context ? ` [${context}]` : ''}`;
  }

  log(message: unknown, context?: string) {
    console.log(this.prefix(context), message);
  }
  error(message: unknown, trace?: string, context?: string) {
    console.error(this.prefix(context), message, trace);
  }
  warn(message: unknown, context?: string) {
    console.warn(this.prefix(context), message);
  }
  debug(message: unknown, context?: string) {
    console.debug(this.prefix(context), message);
  }
  verbose(message: unknown, context?: string) {
    console.log(this.prefix(context), message);
  }
}
