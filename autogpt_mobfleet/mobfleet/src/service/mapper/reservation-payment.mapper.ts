import { IReservationPayment } from "../../domain/usecases";
import { AccountDTO } from "../dto/account.dto";
import { ReservationChargeDTO } from "../dto/reservation-charge.dto";

export class ReservationPaymentMapper {
	public static fromManualChargeDTOToDomain(
		reservationId: number,
		charge: ReservationChargeDTO,
		contractId: number,
		creator: AccountDTO,
	): IReservationPayment.CreateManualChargeParams {
		const partialManualCharge = {
			cardId: charge.cardId,
			description: charge.description,
			valueCents: charge.valueCents,
			paymentMethod: charge.paymentMethod,
			reservationId: reservationId,
			creatorId: creator?.id,
			createdBy: creator?.email,
			contractId,
		};

		return partialManualCharge;
	}

	public static fromCancelChargeDTOtoDomain({
		chargeId,
		contractId,
		reservationId,
		account,
	}: { chargeId: number, contractId: number, account: AccountDTO, reservationId: number }): IReservationPayment.CancelChargeParams {
		return {
			accountId: account.id,
			chargeId,
			contractId,
			reservationId
		}
	}
}
