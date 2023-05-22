import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { accountHasRole } from '../../utils';
import { ContractStatus } from '../../domain/enumeration/contract-status';
import { AccountDTO } from '../../service/dto/account.dto';
import { ContractDTO } from '../../service/dto/contract.dto';
import { RoleType } from '../role-type';

@Injectable()
export class ContractGuard implements CanActivate {
  logger = new Logger('ContractGuard');

  accountIsAdmin (user: AccountDTO) {
    return accountHasRole(user, RoleType.ADMINISTRATOR);
  }

  contractIsValid (contract: ContractDTO) {
    return !!contract && contract.status !== ContractStatus.CANCELED;
  }

  getContractIdFromRequest (request: any) {
    const contractID = request.query.contractID || request.query.contractId || request.query.contract_id;
    return contractID || request.user?.contracts?.[0]?.id;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AccountDTO;
    const contractID = this.getContractIdFromRequest(request);
    
    if (!contractID) return false;

    request.query.contractID = contractID;

    const contract = user?.contracts?.find?.(c => c.id === contractID);
    const { name: contractName, status: contactStatus } = contract ?? {};
    this.logger.debug({ contract: { contractName, contractID, contactStatus }, user: user.id });

    if (this.accountIsAdmin(user) || this.contractIsValid(contract)) {
      return true;
    }

    return false;
  }
}
