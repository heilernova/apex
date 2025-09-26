import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { existsSync, writeFileSync } from 'node:fs';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500;
    let message = 'Error interno del servidor';
    const error: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (exception instanceof Error) {
      status = 500;
      message = exception.message;
    }

    // Registrar el log del errores un un archivo
    if (!existsSync('errors.log')) {
      writeFileSync('errors.log', '');
    }

    const logEntry = `${new Date().toISOString()} - ${request.method} ${request.url} - Status: ${status} - Message: ${message}\n`;
    writeFileSync('errors.log', logEntry, { flag: 'a' });

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      error: error,
    });
  }
}
