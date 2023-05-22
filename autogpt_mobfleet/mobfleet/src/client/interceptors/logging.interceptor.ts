import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req: Request = context.switchToHttp().getRequest();
        const headers = { ...req.headers, authorization: '' };
        const log = `${context.getClass().name}.${context.getHandler().name}() : ${req.method} ${req.url}`;
        Logger.debug(headers, 'RequestHeaders');
        Logger.debug(log, 'LoggingInterceptor');
        return next.handle();
    }
}
