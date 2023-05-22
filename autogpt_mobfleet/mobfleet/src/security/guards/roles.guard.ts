import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountDTO } from '../../service/dto/account.dto';

@Injectable()
export class RolesGuard implements CanActivate {
    logger = new Logger('RolesGuard');
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!roles || roles.includes('ALL')) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user as AccountDTO;
        const response = user && user.roles && user.roles.some(role => roles.includes(role.name));
        this.logger.debug({ user: user.id, roles, response });
        return response;
    }
}
