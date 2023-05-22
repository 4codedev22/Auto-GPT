import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PaymentMethodAdapterFactory } from "../factory/payment-method-adapter-factory";
import { ChargeType } from "../domain/enumeration/charge-type";
import { IPayment, IReservationPayment } from "../domain/usecases";
import { ChargeService } from "./charge.service";
import { ChargeDTO } from "./dto/charge.dto";
import { PaymentMapper } from "./mapper/payment.mapper";
import { ChargeStatus } from "../domain/enumeration/charge-status";
import { ContractService } from "./contract.service";
import { AccountDTO } from "./dto/account.dto";
import { ReservationService } from "./reservation.service";
import { ReservationStatus } from "../domain/enumeration/reservation-status";
import { ReservationDTO } from "./dto/reservation.dto";
import { OrderStatus } from "../domain/enumeration/order-status";

@Injectable()
export class ReservationPaymentService implements IReservationPayment {
  paymentMethodAdapterFactory: PaymentMethodAdapterFactory

  constructor(
    private chargeService: ChargeService,
    private contractService: ContractService,
    private reservationService: ReservationService,
    @Inject('PaymentService') private paymentService: IPayment,
  ) {
    this.paymentMethodAdapterFactory = new PaymentMethodAdapterFactory(this.paymentService);
  }

  private async getChargeById (chargeId: number): Promise<ChargeDTO> {
    const charge = await this.chargeService.findById(chargeId);
    if (!charge) {
      throw new NotFoundException(`Charge not found with id = ${chargeId}`);
    }

    return charge;
  }

  private async getValidReservation (reservationId: number, contractId: number): Promise<ReservationDTO> {
    const reservation = await this.reservationService.findByIdAndContract(reservationId, contractId);

    if (!reservation) {
      throw new NotFoundException(`Reservation with id = ${reservation.id} not found.`);
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Cannot add a new charge to the CANCELLED reservation');
    }

    return reservation;
  }

  private async addOtherChargeValueToReservePaymentInfo (
    reservation: ReservationDTO,
    valueCents: number,
  ): Promise<ReservationDTO> {
    if (!reservation.detailedPaymentInfo?.otherCharges) {
      reservation.detailedPaymentInfo['otherCharges'] = {
        totalCents: 0,
      }
    }

    reservation.detailedPaymentInfo.otherCharges.totalCents += valueCents;
    
    return this.reservationService.update({
      id: reservation.id,
      detailedPaymentInfo: reservation.detailedPaymentInfo
    } as any);
  }

  private async removeOtherChargeValueOfReservePaymentInfo (
    reservation: ReservationDTO,
    valueCents: number,
  ): Promise<ReservationDTO> {
    if (reservation.detailedPaymentInfo?.otherCharges?.totalCents) {
      reservation.detailedPaymentInfo.otherCharges.totalCents -= valueCents;
    }

    return this.reservationService.update({
      id: reservation.id,
      detailedPaymentInfo: reservation.detailedPaymentInfo
    } as any);
  }

  async createManualCharge (
    manualCharge: IReservationPayment.CreateManualChargeParams,
  ): Promise<IReservationPayment.CreateManualChargeResult> {
    const contract = await this.contractService.findById(
      manualCharge.contractId,
      { id: manualCharge.creatorId } as AccountDTO,
    );
    const reservation = await this.getValidReservation(manualCharge.reservationId, contract.id);

    const paymentMethodAdapter = this.paymentMethodAdapterFactory.getAdapterByType(manualCharge.paymentMethod);
    const paymentResult = await paymentMethodAdapter.executePayment(
      PaymentMapper.fromReservationChargeToDomain(manualCharge, reservation, contract),
    );
    
    const charge = new ChargeDTO();
    charge.description = `System charge for #${reservation.pin}`;
    charge.type = ChargeType.MANUAL;
    charge.valueCents = manualCharge.valueCents;
    charge.paymentMethod = manualCharge.paymentMethod;
    charge.reservation = manualCharge.reservationId as any;
    charge.contract = manualCharge.contractId as any;
    charge.createdBy = manualCharge.createdBy;
    charge.selectedCardId = manualCharge.cardId ?? '';
    charge.cardLastFour = paymentResult.cardLastFourDigits ?? '';
    charge.cardBrand = paymentResult.cardBrand ?? '';
    charge.chargeInfo = paymentResult.chargeInfo;
    charge.orderStatus = paymentResult.orderStatus;
    charge.chargeStatus = paymentResult.chargeStatus;

    if (paymentResult.chargeStatus !== ChargeStatus.FAILED) {
      await this.addOtherChargeValueToReservePaymentInfo(reservation, manualCharge.valueCents);
    }
  
    return this.chargeService.save(charge);
  };
  
  async cancelCharge(params: IReservationPayment.CancelChargeParams): Promise<void> {
    const contract = await this.contractService.findById(params.contractId, { id: params.accountId } as AccountDTO);
    const charge = await this.getChargeById(params.chargeId);
    const reservation = await this.reservationService.findByIdAndContract(params.reservationId, params.contractId);
    const paymentMethodAdapter = this.paymentMethodAdapterFactory.getAdapterByType(charge.paymentMethod);

    const cancelResult = await paymentMethodAdapter.cancelPayment(
      PaymentMapper.fromCancelReservationChargeToDomain(
        charge,
        contract
      )
    );

    if (cancelResult.status === OrderStatus.CANCELED) {
      await this.removeOtherChargeValueOfReservePaymentInfo(reservation, charge.valueCents);
    }

    if (charge?.chargeInfo?.orderId) {
      const paymentCanceled = await this.paymentService.getOrder(charge.chargeInfo.orderId, contract?.company?.id);
      charge.chargeInfo = paymentCanceled?.chargeInfo;
    }

    charge.orderStatus = cancelResult.status;
    charge.chargeStatus = ChargeStatus.CANCELED;

    await this.chargeService.save(charge);
  }
}
