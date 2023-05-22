import { ChargeDTO } from "../../../service/dto/charge.dto";
import { PaymentMethodType } from "../../../domain/enumeration/payment-method-type";

export interface IReservationPayment {
  createManualCharge: (charge: IReservationPayment.CreateManualChargeParams) => Promise<IReservationPayment.CreateManualChargeResult>;

  cancelCharge: (params: IReservationPayment.CancelChargeParams) => Promise<void>
}

export namespace IReservationPayment {

  export type CreateManualChargeParams = {
    description: string;
    cardId?: string;
    valueCents: number;
    paymentMethod: PaymentMethodType;
    reservationId: number;
    createdBy: string;
    contractId: number;
    creatorId: number;
  }

  export type CreateManualChargeResult = ChargeDTO;
  export type CancelChargeParams = {
    chargeId: number;
    reservationId: number;
    contractId: number;
    accountId: number;
  };
}
 