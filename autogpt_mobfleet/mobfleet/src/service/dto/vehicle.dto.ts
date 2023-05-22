/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsOptional } from 'class-validator';
import { BaseDTO } from './base.dto';

import { DamageDTO } from './damage.dto';
import { VehicleGroupDTO } from './vehicle-group.dto';
import { VehicleModelDTO } from './vehicle-model.dto';
import { ChecklistDTO } from './checklist.dto';
import { CommandLogDTO } from './command-log.dto';
import { MaintenanceDTO } from './maintenance.dto';
import { RatingDTO } from './rating.dto';
import { ReservationDTO } from './reservation.dto';
import { VehicleStatusLogDTO } from './vehicle-status-log.dto';
import { Gearshift } from '../../domain/enumeration/gearshift';
import { TypeFuel } from '../../domain/enumeration/type-fuel';
import { VehicleColor } from '../../domain/enumeration/vehicle-color';
import { VehicleStatus } from '../../domain/enumeration/vehicle-status';
import { ContractDTO } from './contract.dto';
import { LocationDTO } from './location.dto';
import { ReservationStatus } from '../../domain/enumeration/reservation-status';
import { CurrentVehicleState } from '../../domain/enumeration/current-vehicle-state';
import { Type } from 'class-transformer';

/**
 * A VehicleDTO object.
 */
export class VehicleDTO extends BaseDTO {
    @IsOptional()
    @MaxLength(20)
    @ApiModelProperty({ description: 'chassis field', required: false })
    chassis: string;

    @IsOptional()
    @MaxLength(20)
    @ApiModelProperty({ description: 'licensePlate field', required: false })
    licensePlate: string;

    @IsOptional()
    @MaxLength(20)
    @ApiModelProperty({ description: 'renavam field', required: false })
    renavam: string;

    @ApiModelProperty({ description: 'yearManufacture field', required: false })
    yearManufacture: number;

    @ApiModelProperty({ description: 'yearModel field', required: false })
    yearModel: number;

    @IsOptional()
    @MaxLength(255)
    @ApiModelProperty({ description: 'gearshift field', required: false })
    gearshift: Gearshift;

    @IsOptional()
    @MaxLength(255)
    @ApiModelProperty({ description: 'typeFuel field', required: false })
    typeFuel: TypeFuel;

    @ApiModelProperty({ description: 'tankFuel field', required: false })
    tankFuel: number;

    @ApiModelProperty({ description: 'fuelLevel field', required: false })
    fuelLevel: number;

    @IsOptional()
    @MaxLength(255)
    @ApiModelProperty({ description: 'color field', required: false })
    color: VehicleColor;

    @ApiModelProperty({ description: 'qtyPlace field', required: false })
    qtyPlace: number;

    @IsOptional()
    @MaxLength(255)
    @ApiModelProperty({ description: 'motorization field', required: false })
    motorization: string;

    @IsOptional()
    @MaxLength(36)
    @ApiModelProperty({ description: 'device bluethooth uid field', required: false })
    deviceBleUuid: string;

    @IsOptional()
    @MaxLength(11)
    @ApiModelProperty({ description: 'device_hw_type field', required: false })
    deviceHwType: number;

    @ApiModelProperty({ description: 'defaultHotspot field', required: false })
    defaultHotspot: LocationDTO;

    @IsOptional()
    @MaxLength(255)
    @ApiModelProperty({ description: 'status field', required: false })
    status: VehicleStatus;

    @IsOptional()
    @MaxLength(255)
    @ApiModelProperty({ description: 'licenseLink field', required: false })
    licenseLink: string;

    @IsOptional()
    @MaxLength(255)
    @ApiModelProperty({ description: 'pictureLink field', required: false })
    pictureLink: string;

    @ApiModelProperty({ description: 'reservationStatus field', required: false })
    reservationStatus: ReservationStatus;

    @ApiModelProperty({ description: 'latitude field', required: false })
    latitude: number;

    @ApiModelProperty({ description: 'longitude field', required: false })
    longitude: number;

    @ApiModelProperty({ description: 'currentHotspot field', required: false })
    currentHotspot: LocationDTO;

    @ApiModelProperty({ description: 'positionUpdatedAt field', required: false })
    positionUpdatedAt: any;

    @ApiModelProperty({ description: 'speedKmh field', required: false })
    speedKmh: number;

    @ApiModelProperty({ description: 'odometerKm field', required: false })
    odometerKm: number;

    @ApiModelProperty({ description: 'engineRpm field', required: false })
    engineRpm: number;

    @ApiModelProperty({ description: 'batteryVolts field', required: false })
    batteryVolts: number;

    @ApiModelProperty({ description: 'evBatteryLevel field', required: false })
    evBatteryLevel: number;
    
    @ApiModelProperty({ description: 'evBatteryLevel2 field', required: false })
    evBatteryLevel2: number;

    @ApiModelProperty({ description: 'evRangeKm field', required: false })
    evRangeKm: number;

    @ApiModelProperty({ description: 'telemetryUpdatedAt field', required: false })
    telemetryUpdatedAt: any;

    @ApiModelProperty({ description: 'ignitionStatus field', required: false })
    ignitionStatus: boolean;

    @ApiModelProperty({ description: 'blockStatus field', required: false })
    blockStatus: boolean;

    @ApiModelProperty({ description: 'doorStatus field', required: false })
    doorStatus: boolean;

    @ApiModelProperty({ description: 'hasKeyholder field', required: false })
    hasKeyholder: boolean;

    @ApiModelProperty({ description: 'hasDoorStatus field', required: false })
    hasDoorStatus: boolean;

    @ApiModelProperty({ description: 'sensorsUpdatedAt field', required: false })
    sensorsUpdatedAt: any;

    @ApiModelProperty({ description: 'deviceStatus field', required: false })
    deviceStatus: number;

    @IsOptional()
    @MaxLength(30)
    @ApiModelProperty({ description: 'deviceSerial field', required: false })
    deviceSerial: string;

    @IsOptional()
    @MaxLength(30)
    @ApiModelProperty({ description: 'deviceIccid field', required: false })
    deviceIccid: string;

    @ApiModelProperty({ description: 'deviceTempC field', required: false })
    deviceTempC: number;

    @ApiModelProperty({ description: 'deviceBatteryVolts field', required: false })
    deviceBatteryVolts: number;

    @ApiModelProperty({ description: 'deviceTelemetryUpdatedAt field', required: false })
    deviceTelemetryUpdatedAt: any;

    @ApiModelProperty({ description: 'unsolvedDamagesQty field', required: false })
    unsolvedDamagesQty: number;

    @ApiModelProperty({ description: 'activeAlertsQty field', required: false })
    activeAlertsQty: number;

    @ApiModelProperty({ description: 'dateResetAlertsQuantity field', required: false })
    dateResetAlertsQuantity: any;
    
    @ApiModelProperty({ type: ContractDTO, description: 'contract relationship' })
    contract: ContractDTO;

    @ApiModelProperty({ type: DamageDTO, isArray: true, description: 'damages relationship' })
    damages: DamageDTO[];

    @ApiModelProperty({ type: VehicleGroupDTO, description: 'vehicleGroup relationship' })
    vehicleGroup: VehicleGroupDTO;

    @ApiModelProperty({ type: VehicleModelDTO, description: 'vehicleModel relationship' })
    vehicleModel: VehicleModelDTO;

    @ApiModelProperty({ type: ChecklistDTO, isArray: true, description: 'checklists relationship' })
    checklists: ChecklistDTO[];

    @ApiModelProperty({ type: CommandLogDTO, isArray: true, description: 'commandLogs relationship' })
    commandLogs: CommandLogDTO[];

    @ApiModelProperty({ type: MaintenanceDTO, isArray: true, description: 'maintenances relationship' })
    maintenances: MaintenanceDTO[];

    @ApiModelProperty({ type: RatingDTO, isArray: true, description: 'ratings relationship' })
    ratings: RatingDTO[];

    @ApiModelProperty({ type: ReservationDTO, isArray: true, description: 'reservations relationship' })
    @Type(() => ReservationDTO)
    reservations: ReservationDTO[];

    @ApiModelProperty({ type: VehicleStatusLogDTO, isArray: true, description: 'vehicleStatusLogs relationship' })
    vehicleStatusLogs: VehicleStatusLogDTO[];

    @ApiModelProperty({ type: ReservationDTO, description: 'hasStartedReservation field' })
    inProgressReservation: ReservationDTO;

    @IsOptional()
    @ApiModelProperty({ type: CurrentVehicleState, description: 'current vehicle state' })
    currentVehicleState?: CurrentVehicleState;

    @IsOptional()
    @ApiModelProperty({ description: 'if vehicle is online' })
    isOnline?: boolean;

    @IsOptional()
    @ApiModelProperty({ description: 'if has Active Alerts' })
    hasActiveAlerts?: number;
}
