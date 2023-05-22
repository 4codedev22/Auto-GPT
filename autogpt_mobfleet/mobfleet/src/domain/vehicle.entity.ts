/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Damage } from './damage.entity';
import { VehicleGroup } from './vehicle-group.entity';
import { VehicleModel } from './vehicle-model.entity';
import { Checklist } from './checklist.entity';
import { CommandLog } from './command-log.entity';
import { Maintenance } from './maintenance.entity';
import { Rating } from './rating.entity';
import { Reservation } from './reservation.entity';
import { VehicleStatusLog } from './vehicle-status-log.entity';
import { VehicleColor } from './enumeration/vehicle-color';
import { Gearshift } from './enumeration/gearshift';
import { TypeFuel } from './enumeration/type-fuel';
import { VehicleStatus } from './enumeration/vehicle-status';
import { Contract } from './contract.entity';
import { Location } from './location.entity';
import { ReservationStatus } from './enumeration/reservation-status';

/**
 * A Vehicle.
 */
@Entity('vehicles')
export class Vehicle extends BaseEntity {
    @Column({ name: 'chassis', length: 20, nullable: true })
    @Index('vehicles_chassis_index')
    chassis: string;

    @Column({ name: 'license_plate', length: 20, nullable: true })
    @Index('vehicles_license_plate_index')
    licensePlate: string;

    @Column({ name: 'renavam', length: 20, nullable: true })
    @Index('vehicles_renavam_index')
    renavam: string;

    @Column({ type: 'integer', name: 'year_manufacture', nullable: true })
    yearManufacture: number;

    @Column({ type: 'integer', name: 'year_model', nullable: true })
    yearModel: number;

    @Column({ name: 'gearshift', type: 'enum', nullable: true, enum: Gearshift })
    gearshift: Gearshift;

    @Column({ name: 'type_fuel', type: 'enum', nullable: true, enum: TypeFuel })
    typeFuel: TypeFuel;

    @Column({ type: 'integer', name: 'tank_fuel', nullable: true })
    tankFuel: number;

    @Column({ type: 'integer', name: 'fuel_level', nullable: true })
    fuelLevel: number;

    @Column({ name: 'color', type: 'enum', nullable: true, enum: VehicleColor })
    color: VehicleColor;

    @Column({ type: 'integer', name: 'qty_place', nullable: true })
    qtyPlace: number;

    @Column({ name: 'motorization', length: 255, nullable: true })
    motorization: string;

    @Column({ name: 'status', type: 'enum', nullable: true, enum: VehicleStatus })
    status: VehicleStatus;

    @Column({ name: 'license_link', type: 'text', nullable: true })
    licenseLink: string;

    @Column({ name: 'picture_link', type: 'text', nullable: true })
    pictureLink: string;


    @Column({ name: 'reservation_status', type: 'enum', nullable: true, enum: ReservationStatus })
    reservationStatus: ReservationStatus;

    @OneToOne(type => Reservation, { nullable: true })
    @JoinColumn({ name: 'reservation_id' })
    inProgressReservation: Reservation;

    @Column({ type: 'double', name: 'latitude', nullable: true })
    latitude: number;

    @Column({ type: 'double', name: 'longitude', nullable: true })
    longitude: number;

    @Column({ name: 'device_ble_uuid', length: 36, nullable: true })
    deviceBleUuid: string;

    @Column({ type: 'int', name: 'device_hw_type', nullable: true })
    deviceHwType: number;

    @ManyToOne(type => Location, { nullable: true })
    @JoinColumn({ name: 'current_hotspot_id' })
    currentHotspot: Location;

    @ManyToOne(type => Location, { nullable: true })
    @JoinColumn({ name: 'default_hotspot_id' })
    defaultHotspot: Location;

    @Column({ type: 'datetime', name: 'position_updated_at', nullable: true })
    positionUpdatedAt: any;

    @Column({ type: 'double', name: 'speed_kmh', nullable: true })
    speedKmh: number;

    @Column({ type: 'integer', name: 'odometer_km', nullable: true })
    odometerKm: number;

    @Column({ type: 'integer', name: 'engine_rpm', nullable: true })
    engineRpm: number;

    @Column({ type: 'double', name: 'battery_volts', nullable: true })
    batteryVolts: number;

    @Column({ type: 'double', name: 'ev_battery_level', nullable: true })
    evBatteryLevel: number;

    @Column({ type: 'double', name: 'ev_battery_level2', nullable: true })
    evBatteryLevel2: number;

    @Column({ type: 'integer', name: 'ev_range_km', nullable: true })
    evRangeKm: number;

    @Column({ type: 'datetime', name: 'telemetry_updated_at', nullable: true })
    telemetryUpdatedAt: any;

    @Column({ type: 'tinyint', width: 1, name: 'ignition_status', nullable: true })
    ignitionStatus: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'block_status', nullable: true })
    blockStatus: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'has_keyholder', nullable: false })
    hasKeyholder: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'has_door_status', nullable: false })
    hasDoorStatus: boolean;

    @Column({ type: 'tinyint', width: 1, name: 'door_status', nullable: true })
    doorStatus: boolean;

    @Column({ type: 'datetime', name: 'sensors_updated_at', nullable: true })
    sensorsUpdatedAt: any;

    @Column({ type: 'integer', name: 'device_status', nullable: true })
    deviceStatus: number;

    @Column({ name: 'device_serial', length: 36, nullable: true })
    deviceSerial: string;

    @Column({ name: 'device_iccid', length: 36, nullable: true })
    deviceIccid: string;

    @Column({ type: 'double', name: 'device_temp_c', nullable: true })
    deviceTempC: number;

    @Column({ type: 'double', name: 'device_battery_volts', nullable: true })
    deviceBatteryVolts: number;

    @Column({ type: 'datetime', name: 'device_telemetry_updated_at', nullable: true })
    deviceTelemetryUpdatedAt: any;

    @Column({ type: 'integer', name: 'unsolved_damages_qty', nullable: true })
    @Index('vehicles_unsolved_damages_qty_index')
    unsolvedDamagesQty: number;

    @Column({ type: 'datetime', name: 'date_reset_alerts_quantity', nullable: true })
    dateResetAlertsQuantity: any;

    @ManyToOne(type => Contract)
    @JoinColumn({ name: 'contract_id' })
    contract: Contract;

    @OneToMany(
        type => Damage,
        other => other.vehicle,
    )
    damages: Damage[];

    @ManyToOne(type => VehicleGroup)
    @JoinColumn({ name: 'vehicle_group_id' })
    vehicleGroup: VehicleGroup;

    @ManyToOne(
        type => VehicleModel,
        other => other.vehicles,
    )
    @JoinColumn({ name: 'vehicle_model_id' })
    vehicleModel: VehicleModel;

    @OneToMany(
        type => Checklist,
        other => other.vehicle,
    )
    checklists: Checklist[];

    @OneToMany(
        type => CommandLog,
        other => other.vehicle,
    )
    commandLogs: CommandLog[];

    @OneToMany(
        type => Maintenance,
        other => other.vehicle,
    )
    maintenances: Maintenance[];

    @OneToMany(
        type => Rating,
        other => other.vehicle,
    )
    ratings: Rating[];

    @OneToMany(
        type => Reservation,
        other => other.vehicle,
    )
    reservations: Reservation[];

    @OneToMany(
        type => VehicleStatusLog,
        other => other.vehicle,
    )
    vehicleStatusLogs: VehicleStatusLog[];
}
