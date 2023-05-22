/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Vehicle } from './vehicle.entity';
import { Account } from './account.entity';
import { Reservation } from './reservation.entity';

/**
 * A Checklist.
 */
@Entity('checklists')
export class Checklist extends BaseEntity {
    @Column({ name: 'answers', length: 255, nullable: true })
    answers: string;

    @Column({ type: 'tinyint', width: 1, name: 'item_1', nullable: true })
    item1: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_2', nullable: true })
    item2: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_3', nullable: true })
    item3: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_4', nullable: true })
    item4: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_5', nullable: true })
    item5: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_6', nullable: true })
    item6: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_7', nullable: true })
    item7: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_8', nullable: true })
    item8: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_9', nullable: true })
    item9: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_10', nullable: true })
    item10: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_11', nullable: true })
    item11: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_12', nullable: true })
    item12: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_13', nullable: true })
    item13: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_14', nullable: true })
    item14: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'item_15', nullable: true })
    item15: boolean;

    @Column({ name: 'pictures', length: 500, nullable: true })
    pictures: string;

    @ManyToOne(type => Vehicle)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(type => Reservation)
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;
}
