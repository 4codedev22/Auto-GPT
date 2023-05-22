/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Contract } from './contract.entity';
import { Reservation } from './reservation.entity';
import { ChargeStatus } from './enumeration/charge-status';
import { OrderStatus } from './enumeration/order-status';
import { ChargeType } from './enumeration/charge-type';

/**
 * A Charges.
 */
@Entity('charges')
export class Charge extends BaseEntity {

    @Column({ name: 'description', length: 255, nullable: true })
    description: string;

    @Column({ name: 'payment_method', length: 50, nullable: true })
    paymentMethod: string;

    @Column({ name: 'value_cents', type: 'integer', default: 0 })
    valueCents: number;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @Column({ name: "type", type: 'enum', enum: ChargeType, default: ChargeType.NORMAL })
    type: ChargeType;

    @Column({ name: 'selected_card_id', length: 100 })
    selectedCardId: string;

    @Column({ name: 'card_last_four', length: 4 })
    cardLastFour: string;

    @Column({ name: 'card_brand', length: 100 })
    cardBrand: string;

    @Column({ name: 'charge_info', type: 'json' })
    chargeInfo: any;

    @Column({ name: 'charge_status', type: 'enum', enum: ChargeStatus })
    chargeStatus: ChargeStatus;

    @Column({ name: "order_status", type: 'enum', enum: OrderStatus })
    orderStatus: OrderStatus;

    @ManyToOne(type => Reservation)
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;

    @ManyToOne(type => Contract)
    @JoinColumn({ name: 'contract_id' })
    contract: Contract;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
