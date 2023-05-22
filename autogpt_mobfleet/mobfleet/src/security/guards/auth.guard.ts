import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

import { shouldBypassAuth } from '../decorators/bypass.decorator';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
    logger = new Logger('authGuard');
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): any {
        return (shouldBypassAuth(context, this.reflector) || super.canActivate(context));
    }
}
