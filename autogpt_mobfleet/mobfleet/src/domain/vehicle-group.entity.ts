/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Vehicle } from './vehicle.entity';
import { Contract } from './contract.entity';
import { Account } from './account.entity';

/**
 * A VehicleGroup.
 */
@Entity('vehicle_groups')
export class VehicleGroup extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    name: string;

    @OneToMany(
        type => Vehicle,
        other => other.vehicleGroup,
    )
    vehicles: Vehicle[];

    @ManyToMany(
        type => Contract,
        other => other.vehicleGroups,
    )
    contracts: Contract[];

    @ManyToMany(
        type => Account,
        other => other.vehicleGroups,
    )
    accounts: Account[];
}
