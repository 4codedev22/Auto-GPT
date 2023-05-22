import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AccountDTO } from '../../service/dto/account.dto';

@Injectable()
export class CompanyGuard implements CanActivate {
  logger = new Logger('CompanyGuard');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AccountDTO;
    const companyID = request.query.companyID || request.query.companyId || request.query.company_id;
    request.query.companyID = companyID;

    if (!companyID) {
      if (user.contracts.length !== 1) return false;
      request.query.companyID = user.contracts[0].company.id;
      return true;
    }

    return user?.contracts?.some(contract => contract.company.id === companyID);
  }
}
