import { BadRequestException } from "@nestjs/common";
import { PaymentMethodType } from "../domain/enumeration/payment-method-type";
import { IPaymentMethodAdapter } from "../adapter/payment-method/payment-method-adapter";
import { CreditCardAdapter } from "../adapter/payment-method/credit-card-adapter";
import { IPayment } from "../domain/usecases";
import { ManualPaymentAdapter } from "../adapter/payment-method/manual-payment-adapter";

export interface IPaymentMethodAdapterFactory {
  getAdapterByType: (type: PaymentMethodType) => IPaymentMethodAdapter
}

export class PaymentMethodAdapterFactory implements IPaymentMethodAdapterFactory {
  constructor (private paymentService: IPayment) {}

  getAdapterByType (type: PaymentMethodType) {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD: {
        return new CreditCardAdapter(this.paymentService);
      }
      case PaymentMethodType.MANUAL: {
        return new ManualPaymentAdapter();
      }
      default: throw new BadRequestException('Payment method is not implemented')
    }
  }
}
