/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Damage } from './damage.entity';
import { Account } from './account.entity';
import { Vehicle } from './vehicle.entity';
import { Checklist } from './checklist.entity';
import { Rating } from './rating.entity';
import { ReservationAccount } from './reservation-account.entity';
import { CancellationReason } from './enumeration/cancellation-reason';
import { ReservationStatus } from './enumeration/reservation-status';
import { Location } from './location.entity';
import { Charge } from './charge.entity';
import { UsedDiscountCouponAccount } from './used-discount-coupon-account.entity';

/**
 * A Reservation.
 */
@Entity('reservations')
export class Reservation extends BaseEntity {
    @Column({ name: 'pin', length: 20, nullable: true })
    @Index('reservations_pin_index')
    pin: string;

    @Column({ name: 'destiny', type: 'text', nullable: true })
    destiny: string;

    @Column({ name: 'destiny_nickname', length: 255, nullable: true })
    @Index('reservations_destiny_nickname_index')
    destinyNickname: string;

    @Column({ type: 'double', name: 'destiny_latitude', nullable: true })
    destinyLatitude: number;

    @Column({ type: 'double', name: 'destiny_longitude', nullable: true })
    destinyLongitude: number;

    @Column({ type: 'datetime', name: 'date_withdrawal', nullable: true })
    dateWithdrawal: any;

    @Column({ type: 'datetime', name: 'date_devolution', nullable: true })
    dateDevolution: any;

    @Column({ type: 'integer', name: 'qty_people', nullable: true })
    qtyPeople: number;

    @Column({ type: 'datetime', name: 'date_start', nullable: true })
    dateStart: any;

    @Column({ type: 'datetime', name: 'date_finish', nullable: true })
    dateFinish: any;

    @Column({ name: 'status', type: 'enum', nullable: true, enum: ReservationStatus })
    status: ReservationStatus;

    @Column({ name: 'uf', length: 2, nullable: true })
    uf: string;

    @Column({ type: 'integer', name: 'time_traveled', nullable: true })
    timeTraveled: number;

    @Column({ type: 'float', name: 'travelled_distance', nullable: true })
    travelledDistance: number;

    @Column({ name: 'cancellation_reason', type: 'enum', nullable: true, enum: CancellationReason })
    cancellationReason: CancellationReason;

    @Column({ type: 'bigint', name: 'cancellation_responsible', nullable: true })
    cancellationResponsible: number;

    @Column({ type: 'bigint', name: 'finish_responsible', nullable: true })
    finishResponsible: number;

    @Column({ type: 'datetime', name: 'finish_at', nullable: true })
    finishAt: any;

    @Column({ type: 'datetime', name: 'cancellation_at', nullable: true })
    cancellationAt: any;

    @Column({ type: 'datetime', name: 'vehicle_update_at', nullable: true })
    vehicleUpdateAt: any;

    @Column({ type: 'integer', name: 'type', nullable: true })
    type: number;

    @ManyToOne(type => Location, { nullable: true })
    @JoinColumn({ name: 'origin_location_id' })
    originLocation: Location;

    @ManyToOne(type => Location, { nullable: true })
    @JoinColumn({ name: 'devolution_location_id' })
    devolutionLocation: Location;

    @ManyToOne(type => Location, { nullable: true })
    @JoinColumn({ name: 'destiny_location_id' })
    destinyLocation: Location;

    @Column({ name: 'csv_link', type: 'text', nullable: true })
    csvLink: string;

    @Column({ type: 'integer', name: 'initial_odometer_km', nullable: true })
    initialOdometerKm: number;

    @Column({ type: 'integer', name: 'final_odometer_km', nullable: true })
    finalOdometerKm: number;

    @Column({ type: 'double', name: 'initial_fuel_level', nullable: true })
    initialFuelLevel: number;

    @Column({ type: 'double', name: 'final_fuel_level', nullable: true })
    finalFuelLevel: number;

    @Column({ type: 'json', name: 'charge_table', nullable: true })
    chargeTable: any;

    @Column({ type: 'json', name: 'detailed_payment_info', nullable: true })
    detailedPaymentInfo: any;

    @Column({ length: 100, name: 'selected_card_id', nullable: true })
    selectedCardId: string;

    @OneToMany(type => Damage, other => other.reservation,)
    damages: Damage[];

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(type => Vehicle)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;

    @OneToMany(type => Checklist, other => other.reservation,)
    checklists: Checklist[];

    @OneToMany(type => Rating, other => other.reservation,)
    ratings: Rating[];

    @OneToMany(type => ReservationAccount, other => other.reservation,)
    reservationAccounts: ReservationAccount[];

    @OneToMany(type => Charge, other => other.reservation,)
    charges: Charge[];

    @OneToMany(type => UsedDiscountCouponAccount, other => other.reservation)
    usedDiscountCoupons: UsedDiscountCouponAccount[];
}
