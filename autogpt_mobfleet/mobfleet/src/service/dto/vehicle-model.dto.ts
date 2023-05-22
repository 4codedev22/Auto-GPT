/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { VehicleManufacturerDTO } from './vehicle-manufacturer.dto';
import { VehicleDTO } from './vehicle.dto';

/**
 * A VehicleModelDTO object.
 */
export class VehicleModelDTO extends BaseDTO {
    @MaxLength(50)
    @ApiModelProperty({ description: 'name field', required: false })
    name: string;

    @ApiModelProperty({ description: 'type field', required: false })
    type: number;

    @ApiModelProperty({ description: 'classification field', required: false })
    classification: number;

    @ApiModelProperty({ description: 'maintenanceKm field', required: false })
    maintenanceKm: number;

    @ApiModelProperty({ description: 'maintenanceMonths field', required: false })
    maintenanceMonths: number;

    @ApiModelProperty({ isArray:true, description: 'photos field', required: false })
    photos: string[];

    @ApiModelProperty({ type: VehicleManufacturerDTO, description: 'vehicleManufacturer relationship' })
    vehicleManufacturer: VehicleManufacturerDTO;

    @ApiModelProperty({ type: VehicleDTO, isArray: true, description: 'vehicles relationship' })
    vehicles: VehicleDTO[];
}
