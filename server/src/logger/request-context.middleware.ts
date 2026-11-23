import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContextService } from './request-context.js';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly ctx: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) ?? randomUUID();
    res.setHeader('X-Request-Id', requestId);

    this.ctx.run({ requestId }, () => next());
  }
}
