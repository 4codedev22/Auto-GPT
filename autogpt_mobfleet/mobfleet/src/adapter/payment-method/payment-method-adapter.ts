import { OrderStatus } from "../../domain/enumeration/order-status";
import { ChargeStatus } from "../../domain/enumeration/charge-status";
import { IPayment } from "../../domain/usecases";

export interface IPaymentMethodAdapter {
  
  executePayment: (params: IPaymentMethodAdapter.ExecutePaymentParams) => Promise<IPaymentMethodAdapter.ExecutePaymentResult>;

  cancelPayment: (params: IPaymentMethodAdapter.CancelPaymentParams) => Promise<IPaymentMethodAdapter.CancelPaymentResult>;
}

export namespace IPaymentMethodAdapter {
  export type ExecutePaymentParams = IPayment.CreateOrderParams;
  export type ExecutePaymentResult = IPayment.CreateOrderResult;
  export type CancelPaymentParams = IPayment.CancelOrderParams;
  export type CancelPaymentResult = {
    status: OrderStatus;
    chargeInfo: any;
  }
}
