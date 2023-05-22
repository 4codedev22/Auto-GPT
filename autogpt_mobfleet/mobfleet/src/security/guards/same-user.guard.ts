import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../../service/auth.service';
import { AccountDTO } from '../../service/dto/account.dto';

@Injectable()
export class SameUserGuard implements CanActivate {
  logger = new Logger('SameUserGuard');

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AccountDTO;
    const contractID = request.query.contractID;
    const { username, password, currentContract } = request.body;
    this.logger.debug({ username, currentContract });

    if (+contractID !== +currentContract) return false;
    return await this.authService.isSameUser(user, { username, password, currentContract });
  }
}
