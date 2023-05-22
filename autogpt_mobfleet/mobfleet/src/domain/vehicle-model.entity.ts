/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { VehicleManufacturer } from './vehicle-manufacturer.entity';
import { Vehicle } from './vehicle.entity';

/**
 * A VehicleModel.
 */
@Entity('vehicle_models')
export class VehicleModel extends BaseEntity {
    @Column({ name: 'name', length: 50, nullable: true })
    @Index('vehicle_models_name_index')
    name: string;

    @Column({ type: 'integer', name: 'type', nullable: true })
    type: number;

    @Column({ type: 'integer', name: 'classification', default: 0 })
    classification: number;

    @Column({ type: 'integer', name: 'maintenance_km', nullable: true })
    maintenanceKm: number;

    @Column({ type: 'integer', name: 'maintenance_months', nullable: true })
    maintenanceMonths: number;

    @Column({ name: 'photos',  type: 'json',  nullable: true })
    photos: string[];

    @ManyToOne(type => VehicleManufacturer)
    @JoinColumn({ name: 'vehicle_manufacturer_id' })
    vehicleManufacturer: VehicleManufacturer;

    @OneToMany(
        type => Vehicle,
        other => other.vehicleModel,
    )
    vehicles: Vehicle[];
}
