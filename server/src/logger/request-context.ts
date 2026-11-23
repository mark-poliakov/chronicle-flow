import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  requestId: string;
}

@Injectable()
export class RequestContextService {
  private readonly als = new AsyncLocalStorage<RequestContext>();

  run<T>(ctx: RequestContext, callback: () => T): T {
    return this.als.run(ctx, callback);
  }

  get requestId(): string | undefined {
    return this.als.getStore()?.requestId;
  }
}
