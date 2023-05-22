import { Injectable, Logger } from '@nestjs/common';

import { CardDTO } from '../service/dto/card.dto';
import { AccountService } from './account.service';
import { CompanyService } from './company.service';
import { PagarmeService } from './pagarme.service';
import { AccountDTO } from './dto/account.dto';

@Injectable()
export class CardService {
  logger = new Logger('CardService');

  constructor(private readonly pagarmeService: PagarmeService, private readonly accountService: AccountService, private readonly companyService: CompanyService) { }

  async getToken(companyID: number): Promise<string> {
    const tokens = await this.pagarmeService.getTokens(companyID);
    return tokens.public;
  }

  async list(companyID: number, account: AccountDTO): Promise<CardDTO[]> {
    return this.pagarmeService.listCards(companyID, account);
  }

  async listByAccountId(accountId: number, companyID: number): Promise<CardDTO[]> {
    const account = await this.accountService.findById(accountId);
    return this.pagarmeService.listCards(companyID, account);
  }

  async create(companyID: number, account: AccountDTO, cardToken: string): Promise<CardDTO> {
    return this.pagarmeService.createCard(companyID, account, cardToken);
  }

  async delete(companyID: number, account: AccountDTO, cardID: string): Promise<CardDTO> {
    return await this.pagarmeService.deleteCard(companyID, account, cardID);
  }
}
