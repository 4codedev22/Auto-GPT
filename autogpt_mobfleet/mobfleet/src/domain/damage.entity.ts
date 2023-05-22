/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Contract } from './contract.entity';
import { Vehicle } from './vehicle.entity';
import { Account } from './account.entity';
import { Reservation } from './reservation.entity';
import { DamageType } from './enumeration/damage-type';

/**
 * A Damage.
 */
@Entity('damages')
export class Damage extends BaseEntity {
    @Column({ type: 'tinyint', width: 1, name: 'active', nullable: true })
    solved: boolean;

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'solver_id' })
    solver: Account;

    @Column({ type: 'json', name: 'damage_images', nullable: true })
    damageImages: string[];

    @Column({ type: 'json', name: 'solution_images', nullable: true })
    solutionImages: string[];

    @Column({ type: 'text', name: 'solution_comment', nullable: true })
    solutionComment: string;

    @Column({ type: 'datetime', name: 'solved_at', nullable: true })
    solvedAt: any;

    @Column({ type: 'datetime', name: 'deleted_at', nullable: true })
    deletedAt: any;

    @Column({ name: 'title', length: 255, nullable: true })
    title: string;

    @Column({ name: 'description', length: 255, nullable: true })
    description: string;

    @Column({ type: 'tinyint', width: 1, name: 'impeditive', nullable: true })
    impeditive: boolean;

    @Column({ type: 'enum', name: 'type', nullable: true, enum: DamageType })
    type: DamageType;

    @ManyToOne(type => Contract)
    @JoinColumn({ name: 'contract_id' })
    contract: Contract;

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
