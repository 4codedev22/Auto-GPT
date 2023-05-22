/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { isBefore } from 'date-fns';

import { BaseDTO } from './base.dto';
import { DamageDTO } from './damage.dto';
import { AccountDTO } from './account.dto';
import { VehicleDTO } from './vehicle.dto';
import { ChecklistDTO } from './checklist.dto';
import { RatingDTO } from './rating.dto';
import { ReservationAccountDTO } from './reservation-account.dto';
import { ChargeDTO } from './charge.dto';
import { DiscountCouponDTO } from './discount-coupon.dto';
import { ReservationStatus } from '../../domain/enumeration/reservation-status';
import { CancellationReason } from '../../domain/enumeration/cancellation-reason';
import { Location } from '../../domain/location.entity';
import { UsedDiscountCouponAccountDTO } from './used-discount-coupon-account.dto';

/**
 * A ReservationDTO object.
 */
export class ReservationDTO extends BaseDTO {
    @MaxLength(20)
    @ApiModelProperty({ description: 'pin field', required: false })
    pin: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'destiny field', required: false })
    destiny: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'destinyNickname field', required: false })
    destinyNickname: string;

    @ApiModelProperty({ description: 'destinyLatitude field', required: false })
    destinyLatitude: number;

    @ApiModelProperty({ description: 'destinyLongitude field', required: false })
    destinyLongitude: number;

    @ApiModelProperty({ description: 'dateWithdrawal field', required: false })
    @Type(() => Date)
    dateWithdrawal: any;

    @ApiModelProperty({ description: 'dateDevolution field', required: false })
    dateDevolution: any;

    @ApiModelProperty({ description: 'qtyPeople field', required: false })
    qtyPeople: number;

    @ApiModelProperty({ description: 'dateStart field', required: false })
    dateStart: any;

    @ApiModelProperty({ description: 'dateFinish field', required: false })
    dateFinish: any;

    @ApiModelProperty({ description: 'status field', required: false })
    @Transform(({ value, obj: race }) => {
        if (race?.id && race?.status == ReservationStatus.IN_PROGRESS && isBefore(race?.dateDevolution, Date.now())) {
            return ReservationStatus.OVERDUE;
        }
        return value;
    })
    status: ReservationStatus;

    @MaxLength(2)
    @ApiModelProperty({ description: 'uf field', required: false })
    uf: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'timeTraveled field' })
    timeTraveled: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'travelledDistance field' })
    travelledDistance: number;

    @ApiModelProperty({ description: 'cancellationReason field', required: false })
    cancellationReason: CancellationReason;

    @ApiModelProperty({ description: 'cancellationResponsible field', required: false })
    cancellationResponsible: number;

    @ApiModelProperty({ description: 'finishResponsible field', required: false })
    finishResponsible: number;

    @ApiModelProperty({ description: 'finishAt field', required: false })
    finishAt: any;

    @ApiModelProperty({ description: 'cancellationAt field', required: false })
    cancellationAt: any;

    @ApiModelProperty({ description: 'vehicleUpdateAt field', required: false })
    vehicleUpdateAt: any;

    @ApiModelProperty({ description: 'type field', required: false })
    type: number;

    @ApiModelProperty({ description: 'originLocation field', required: false })
    originLocation: Location;

    @ApiModelProperty({ description: 'devolutionLocation field', required: false })
    devolutionLocation: Location;

    @ApiModelProperty({ description: 'destinyLocation field', required: false })
    destinyLocation: Location;

    @MaxLength(255)
    @ApiModelProperty({ description: 'csvLink field', required: false })
    csvLink: string;

    @ApiModelProperty({ description: 'initialOdometerKm field', required: false })
    initialOdometerKm: number;

    @ApiModelProperty({ description: 'finalOdometerKm field', required: false })
    finalOdometerKm: number;

    @ApiModelProperty({ description: 'initialFuelLevel field', required: false })
    initialFuelLevel: number;

    @ApiModelProperty({ description: 'finalFuelLevel field', required: false })
    finalFuelLevel: number;

    @ApiModelProperty({ description: 'chargeTable field', required: false })
    chargeTable: any;

    @ApiModelProperty({ description: 'detailedPaymentInfo field', required: false })
    detailedPaymentInfo: any;

    @ApiModelProperty({ description: 'selectedCardId field', required: false })
    selectedCardId: string;

    @ApiModelProperty({ description: 'couponConditions field', required: false })
    couponConditions: any;

    @ApiModelProperty({type:DiscountCouponDTO, description: 'discountCoupon relationship' })
    discountCoupon: DiscountCouponDTO;

    @ApiModelProperty({ type: DamageDTO, isArray: true, description: 'damages relationship' })
    damages: DamageDTO[];

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;

    @ApiModelProperty({ type: VehicleDTO, description: 'vehicle relationship' })
    vehicle: VehicleDTO;

    @ApiModelProperty({ type: ChecklistDTO, isArray: true, description: 'checklists relationship' })
    checklists: ChecklistDTO[];

    @ApiModelProperty({ type: RatingDTO, isArray: true, description: 'ratings relationship' })
    ratings: RatingDTO[];

    @ApiModelProperty({ type: ReservationAccountDTO, isArray: true, description: 'reservationAccounts relationship' })
    reservationAccounts: ReservationAccountDTO[];

    @ApiModelProperty({ type: ChargeDTO, isArray: true, description: 'charges relationship' })
    charges: ChargeDTO[];

    @ApiModelProperty({ type: UsedDiscountCouponAccountDTO, isArray: true, description: 'used discount coupons relationship' })
    usedDiscountCoupons: UsedDiscountCouponAccountDTO[];
}
