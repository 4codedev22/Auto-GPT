import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { OrderStatus } from "../domain/enumeration/order-status";
import { IPayment } from "../domain/usecases/payment/payment";
import { CompanyService } from "./company.service";
import { PaymentMapper } from "./mapper/payment.mapper";

@Injectable()
export class PaymentService implements IPayment {
  logger = new Logger('PaymentService');

  constructor(
    private readonly companyService: CompanyService,
  ){}

  private readonly baseURL = 'https://api.pagar.me/core/v5';

  private async getSecretKey (companyID: number): Promise<string> {
    const company = await this.companyService.findById(companyID);
    const secretKey = company.paymentSecretKey;

    return Buffer.from(`${secretKey}:`).toString('base64');
  }

  private async getHttpHeadersWithAuth (companyId: number) {
    const secretKey = await this.getSecretKey(companyId);
    const authorization = `Basic ${secretKey}`;

    return {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    };
  }

  async createOrder (order: IPayment.CreateOrderParams): Promise<IPayment.CreateOrderResult> {
    const options = await this.getHttpHeadersWithAuth(order.companyId);
    const body = {
      "customer_id": order.clientId,
      "items": [
        {
          "description": order.item?.description,
          "amount": order.item?.valueCents,
          "quantity": 1,
        }
      ],
      "payments": [
        {
          "payment_method": order.paymentMethod,
          [order.paymentMethod]: {
            "operation_type": "auth_and_capture",
            "recurrence": false,
            "installments": 1,
            "statement_descriptor": order.description,
            "card_id": order.cardId
          }
        }
      ],
      "closed": true,
      "antifraud_enabled": false
    }    

    try {
      const response = await axios.post(`${this.baseURL}/orders`, body, options).then(resp => resp.data);

      if (response) {
        return PaymentMapper.fromPagarmeResponseToDomain(response);
      }
    } catch (e) {
      this.logger.error(e);
    }
  
    return {
      cardBrand: undefined,
      cardLastFourDigits: undefined,
      chargeStatus: undefined,
      orderStatus: OrderStatus.FAILED,
      orderId: undefined,
      chargeInfo: undefined,
    };
  };

  async cancelOrder (params: IPayment.CancelOrderParams): Promise<IPayment.CancelOrderResult> {
    const options = await this.getHttpHeadersWithAuth(params.companyId);
    const url = `${this.baseURL}/charges/${params.orderId}`;

    try {
      const response = await axios.delete(url, options);
  
      if (response?.status === 200) {
        return response.data;
      }
    } catch (e) {
      this.logger.error(e);
    }

    return undefined;
  }

  async getOrder(orderId: string, companyId: number): Promise<IPayment.GetOrderResult> {
    const options = await this.getHttpHeadersWithAuth(companyId);
    const url = `${this.baseURL}/orders/${orderId}`;

    try {
      const response = await axios.get(url, options);

      if (response && response.status === 200 && response.data) {
        return PaymentMapper.fromPagarmeResponseToDomain(response.data);
      }

    } catch (e) {
      this.logger.error(e);
    }
    return undefined;
  }

}
