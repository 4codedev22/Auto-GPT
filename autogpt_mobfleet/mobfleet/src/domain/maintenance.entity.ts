/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Vehicle } from './vehicle.entity';
import { Account } from './account.entity';

/**
 * A Maintenance.
 */
@Entity('maintenances')
export class Maintenance extends BaseEntity {
    @Column({ type: 'integer', name: 'type', nullable: true })
    @Index('maintenances_type_index')
    type: number;

    @Column({ name: 'description', length: 512, nullable: true })
    @Index('maintenances_description_index')
    description: string;

    @Column({ type: 'integer', name: 'odometer_km', nullable: true })
    odometerKm: number;

    @ManyToOne(type => Vehicle)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;
}
