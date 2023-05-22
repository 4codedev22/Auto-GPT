import { ChargeStatus } from "../../domain/enumeration/charge-status";
import { OrderStatus } from "../../domain/enumeration/order-status";
import { IPaymentMethodAdapter } from "./payment-method-adapter";

export class ManualPaymentAdapter implements IPaymentMethodAdapter {
  
  async executePayment(params: IPaymentMethodAdapter.ExecutePaymentParams): Promise<IPaymentMethodAdapter.ExecutePaymentResult> {
    const payment = {
      chargeStatus: ChargeStatus.PAID,
      orderStatus: OrderStatus.PAID,
      chargeInfo: {
        data: {
          items: [{
            amount: params.item?.valueCents,
            description: params.item?.description,
          }]
        }
      }
    }

    return payment;
  }

  async cancelPayment(params: IPaymentMethodAdapter.CancelPaymentParams): Promise<IPaymentMethodAdapter.CancelPaymentResult> {

    return  {
      status: OrderStatus.CANCELED,
      chargeInfo: undefined
    }
  }

}
