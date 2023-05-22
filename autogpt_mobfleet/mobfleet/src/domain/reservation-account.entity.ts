/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Account } from './account.entity';
import { Reservation } from './reservation.entity';

/**
 * A ReservationAccount.
 */
@Entity('reservation_accounts')
export class ReservationAccount extends BaseEntity {
    @Column({ type: 'tinyint', width: 1, name: 'status', nullable: true })
    status: boolean;

    @Column({ name: 'message', type: 'text', nullable: true })
    message: string;

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(type => Reservation)
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;
}
