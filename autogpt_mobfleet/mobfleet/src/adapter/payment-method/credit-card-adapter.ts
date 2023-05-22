import { OrderStatus } from "../../domain/enumeration/order-status";
import { IPayment } from "../../domain/usecases";
import { IPaymentMethodAdapter } from "./payment-method-adapter";

export class CreditCardAdapter implements IPaymentMethodAdapter {
  
  constructor (private paymentService: IPayment) { }

  async executePayment(params: IPaymentMethodAdapter.ExecutePaymentParams): Promise<IPaymentMethodAdapter.ExecutePaymentResult> {
    return this.paymentService.createOrder({ ...params, paymentMethod: 'credit_card' });
  }

  async cancelPayment(params: IPaymentMethodAdapter.CancelPaymentParams): Promise<IPaymentMethodAdapter.CancelPaymentResult> {
    const cancelOrderResult = await this.paymentService.cancelOrder(params);

    return  {
      status: OrderStatus.CANCELED,
      chargeInfo: cancelOrderResult
    }
  }
}
