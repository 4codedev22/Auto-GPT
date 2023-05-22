import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { AccountService } from './account.service';
import { CompanyService } from './company.service';

import { PagarmeMapper } from './mapper/pagarme.mapper';

import { AccountDTO } from './dto/account.dto';
import { CardDTO } from './dto/card.dto';


export type ChargeItem = {
  description: string;
  amountInCents: number;
  quantity: number;
};

export type PaymentInfo = {
  description: string;
  cardId: string;
  customerId: string;
}

export enum OperationType {
  AuthOnly = "auth_only",
  AuthAndCapture = "auth_and_capture",
  PreAuth = "pre_auth"
}

@Injectable()
export class PagarmeService {
  logger = new Logger('PagarmeService');

  private readonly baseURL = () => { return "https://api.pagar.me/core/v5"; };

  constructor(private readonly accountService: AccountService, private readonly companyService: CompanyService) { }

  async getTokens(companyID: number): Promise<{ public: string, secret: string } | undefined> {
    if (!companyID) return;
    const company = await this.companyService.findById(companyID);
    if (!company) return;
    const publicKey = company.paymentPublicKey;
    const secretKey = company.paymentSecretKey;

    return {
      public: `${publicKey}`,
      secret: `${Buffer.from(secretKey + ':').toString('base64')}`
    };
  }

  async getCustomerID(companyID: number, account: AccountDTO): Promise<string> {
    if (account.customerId) return account.customerId;

    const tokens = await this.getTokens(companyID);
    const authorization = `Basic ${tokens.secret}`;

    const url = `${this.baseURL()}/customers`;

    const body = {
      name: account.name,
      email: account.email,
      code: account.id,
    }

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    };

    try {
      let customerId = "";

      const response = await axios.post(url, body, options);
      if (response && response.status === 200 && response.data) customerId = `${response.data.id}`;

      account.customerId = customerId;
      account = await this.accountService.save(account);
    } catch (error) {
      const errorMessage = error.response?.data || error.message || error;
      this.logger.error(errorMessage);
    }

    return account.customerId;
  }

  async getOrder(companyID: number, orderId: string): Promise<any> {
    const tokens = await this.getTokens(companyID);
    const authorization = `Basic ${tokens.secret}`;

    const url = `${this.baseURL()}/orders/${orderId}`;

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    };

    try {
      const response = await axios.get(url, options);

      if (response && response.status === 200 && response.data) {
        return {
          orderId: response.data.id,
          status: response.data.status,
          data: response.data
        };
      }

    } catch (e) {
      this.logger.error(e);
    }
    return undefined;
  }

  async listCards(companyID: number, account: AccountDTO): Promise<CardDTO[]> {
    const customerId = await this.getCustomerID(companyID, account);
    const tokens = await this.getTokens(companyID);
    const authorization = `Basic ${tokens.secret}`;

    const url = `${this.baseURL()}/customers/${customerId}/cards`;

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    };

    try {
      const response = await axios.get(url, options);

      if (response && response.status === 200 && response.data && response.data.data && response.data.data.length > 0) {
        return PagarmeMapper.toCardsDTO(response.data.data);
      }

    } catch (e) {
      this.logger.error(e);
    }
    return [];
  }

  async createCard(companyID: number, account: AccountDTO, cardToken: string): Promise<CardDTO> {
    const customerId = await this.getCustomerID(companyID, account);
    const tokens = await this.getTokens(companyID);
    const authorization = `Basic ${tokens.secret}`;

    const url = `${this.baseURL()}/customers/${customerId}/cards`;

    const body = {
      token: cardToken,
      // options: { verify_card: true }
    }

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    };

    try {
      const response = await axios.post(url, body, options);

      if (response && response.status === 200 && response.data) {
        return PagarmeMapper.toCardDTO(response.data);
      }

    } catch (error) {
      const errorMessage = error.response?.data || error.message || error;
      this.logger.error(errorMessage);
    }
    return undefined;
  }

  async deleteCard(companyID: number, account: AccountDTO, cardID: string): Promise<CardDTO> {
    const customerId = await this.getCustomerID(companyID, account);
    const tokens = await this.getTokens(companyID);
    const authorization = `Basic ${tokens.secret}`;

    const url = `${this.baseURL()}/customers/${customerId}/cards/${cardID}`;

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    };

    try {
      const response = await axios.delete(url, options);

      if (response && response.status === 200 && response.data) {
        return PagarmeMapper.toCardDTO(response.data);
      }

    } catch (e) {
      this.logger.error(e);
    }
    return undefined;
  }

  async createOrderAndCapture(companyID: number, item: ChargeItem, payment: PaymentInfo): Promise<any> {
    try {
      const operation = OperationType.AuthAndCapture;
      const response = await this.createOrder(companyID, item, payment, operation);

      if (response && response.status) { return response; }
    } catch (e) {
      this.logger.error(e);
    }
    return undefined;
  }
  
  async createOrderPreAuth(companyID: number, item: ChargeItem, payment: PaymentInfo): Promise<any> {
    try {
      const operation = OperationType.PreAuth;
      const response = await this.createOrder(companyID, item, payment, operation);

      if (response && response.status) { return response; }
    } catch (e) {
      this.logger.error(e);
    }
    return undefined;
  }
  
  async createOrder(companyID: number, item: ChargeItem, payment: PaymentInfo, operation: OperationType): Promise<any> {
    const tokens = await this.getTokens(companyID);
    const authorization = `Basic ${tokens.secret}`;

    const url = `${this.baseURL()}/orders`;

    const body = {
      "customer_id": payment.customerId,
      "items": [
        {
          "description": item.description,
          "amount": item.amountInCents,
          "quantity": item.quantity
        }
      ],
      "payments": [
        {
          "payment_method": "credit_card",
          "credit_card": {
            "operation_type": operation as string,
            "recurrence": false,
            "installments": 1,
            "statement_descriptor": payment.description,
            "card_id": payment.cardId
          }
        }
      ],
      "closed": true,
      "antifraud_enabled": false
    }

    this.logger.log("====== PAGARME DEBUG ======");
    this.logger.log(companyID);
    this.logger.log(url);
    this.logger.log(JSON.stringify(body));

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    };

    try {
      const response = await axios.post(url, body, options);

      if (response && response.data) {
        return {
          orderId: response.data.id,
          status: response.data.status,
          data: response.data
        };
      }

    } catch (error) {
      const errorMessage = error.response?.data || error.message || error;
      this.logger.error(errorMessage);
    }
    return undefined;
  }

  async cancellCharge(companyID: number, chargeId: string): Promise<any> {
    const tokens = await this.getTokens(companyID);
    const authorization = `Basic ${tokens.secret}`;

    const url = `${this.baseURL()}/charges/${chargeId}`;

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    };

    try {
      const response = await axios.delete(url, options);

      if (response && response.status === 200 && response.data) {
        return response.data;
      }

    } catch (e) {
      this.logger.error(e);
    }
    return undefined;
  }
    
}



