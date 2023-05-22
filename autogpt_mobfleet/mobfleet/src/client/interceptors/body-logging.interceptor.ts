import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class BodyLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        try {
            const req: Request = context.switchToHttp().getRequest();
            const { authorization, ...headers } = req.headers;
            const log = `${context.getClass().name}.${context.getHandler().name}() : ${req.method} ${req.url}`;
            Logger.debug({ headers, log, body: JSON.stringify(req.body) }, 'VehicleLoggingInterceptor');
        } finally { }
        return next.handle();
    }
}
