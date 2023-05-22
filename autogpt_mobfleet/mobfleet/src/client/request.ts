import { Request as ExpressRequest } from 'express';
import { ContractDTO } from '../service/dto/contract.dto';
import { AccountDTO } from '../service/dto/account.dto';

export interface Request extends ExpressRequest {
    user?: AccountDTO;
    contract?: ContractDTO
}
