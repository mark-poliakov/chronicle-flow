import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(err: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const map: Record<string, { status: number; message: string }> = {
      P2002: { status: HttpStatus.CONFLICT, message: 'Resource already exists' },
      P2025: { status: HttpStatus.NOT_FOUND, message: 'Resource not found' },
      P2003: { status: HttpStatus.BAD_REQUEST, message: 'Related resource is missing' },
    };
    const mapped = map[err.code] ?? {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database error',
    };

    res.status(mapped.status).json({ statusCode: mapped.status, message: mapped.message });
  }
}
