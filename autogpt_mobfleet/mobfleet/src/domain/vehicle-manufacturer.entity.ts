/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { VehicleModel } from './vehicle-model.entity';

/**
 * A VehicleManufacturer.
 */
@Entity('vehicle_manufacturers')
export class VehicleManufacturer extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    name: string;

    @OneToMany(
        type => VehicleModel,
        other => other.vehicleManufacturer,
    )
    vehicleModels: VehicleModel[];
}
