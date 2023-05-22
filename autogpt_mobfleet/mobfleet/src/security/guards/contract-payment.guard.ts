import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ContractService } from '../../service/contract.service';
import { AccountDTO } from '../../service/dto/account.dto';

@Injectable()
export class ContractPaymentGuard implements CanActivate {
  logger = new Logger('ContractPaymentGuard');

  constructor(
    @Inject(forwardRef(() => ContractService))
    private readonly contractService: ContractService
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AccountDTO;
    const contractID = +request.query.contractID;

    this.logger.debug({ userID: user.id, contractID });

    const contract = await this.contractService.findById(contractID, user);
    request.contract = contract;
    return !!contract?.company?.paymentEnabled;
  }
}
