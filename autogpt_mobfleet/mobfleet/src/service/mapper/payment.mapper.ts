import { IPayment, IReservationPayment } from "../../domain/usecases";
import { ChargeDTO } from "../dto/charge.dto";
import { ContractDTO } from "../dto/contract.dto";
import { ReservationDTO } from "../dto/reservation.dto";

export class PaymentMapper {
	public static fromReservationChargeToDomain(
		charge: IReservationPayment.CreateManualChargeParams,
		reservation: ReservationDTO,
		contract: ContractDTO,
	): IPayment.CreateOrderParams {
		const domainOrder: IPayment.CreateOrderParams = {
			cardId: charge.cardId,
			description: contract?.company?.paymentDescriptor,
			item: {
				description: charge.description,
				quantity: 1,
				valueCents: charge.valueCents,
			},
			clientId: reservation?.account?.customerId,
			paymentMethod: charge.paymentMethod,
			companyId: contract?.company?.id,
		};

		Object.keys(domainOrder).forEach(
			key => domainOrder[key] === undefined && delete domainOrder[key],
		);

		return domainOrder;
	}

	public static fromCancelReservationChargeToDomain(charge: ChargeDTO, contract: ContractDTO): IPayment.CancelOrderParams {
		return {
			companyId: contract?.company?.id,
			orderId: charge?.chargeInfo?.data?.charges?.[0]?.id,
		}
	}

	public static fromPagarmeResponseToDomain(pagarmeResponse: any): IPayment.CreateOrderResult {
		return {
			cardBrand: pagarmeResponse?.charges[0]?.last_transaction?.card?.brand || "",
			cardLastFourDigits: pagarmeResponse?.charges[0]?.last_transaction?.card?.last_four_digits || "",
			chargeStatus: pagarmeResponse?.charges[0]?.status,
			orderStatus: pagarmeResponse?.status,
			orderId: pagarmeResponse?.id,
			chargeInfo: {
				data: pagarmeResponse,
				orderId: pagarmeResponse.id,
				status: pagarmeResponse.status
			},
		};
	}

}
