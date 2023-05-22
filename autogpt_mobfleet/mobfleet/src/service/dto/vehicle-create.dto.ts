/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

import { Gearshift } from '../../domain/enumeration/gearshift';
import { TypeFuel } from '../../domain/enumeration/type-fuel';
import { VehicleColor } from '../../domain/enumeration/vehicle-color';
import { VehicleStatus } from '../../domain/enumeration/vehicle-status';

/**
 * A VehicleDTO object.
 */
export class VehicleCreateDTO {
    @MaxLength(20)
    @ApiModelProperty({ description: 'chassis field', required: false })
    chassis: string;

    @MaxLength(20)
    @ApiModelProperty({ description: 'licensePlate field', required: false })
    licensePlate: string;

    @MaxLength(20)
    @ApiModelProperty({ description: 'renavam field', required: false })
    renavam: string;

    @ApiModelProperty({ description: 'yearManufacture field', required: false })
    yearManufacture: number;

    @ApiModelProperty({ description: 'yearModel field', required: false })
    yearModel: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'gearshift field', required: false })
    gearshift: Gearshift;

    @MaxLength(255)
    @ApiModelProperty({ description: 'typeFuel field', required: false })
    typeFuel: TypeFuel;

    @ApiModelProperty({ description: 'tankFuel field', required: false })
    tankFuel: number;

    @ApiModelProperty({ description: 'fuelLevel field', required: false })
    fuelLevel: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'color field', required: false })
    color: VehicleColor;

    @ApiModelProperty({ description: 'qtyPlace field', required: false })
    qtyPlace: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'motorization field', required: false })
    motorization: string;

    @ApiModelProperty({ description: 'defaultHotspot field', required: false })
    defaultHotspotId: number;

    @ApiModelProperty({ description: 'status field', required: false })
    status: VehicleStatus;

    @ApiModelProperty({ description: 'hasKeyholder field', required: false })
    hasKeyholder: boolean;

    @ApiModelProperty({ description: 'hasDoorStatus field', required: false })
    hasDoorStatus: boolean;

    @ApiModelProperty({ description: 'vehicleGroup ID field' })
    vehicleGroupId: number;

    @ApiModelProperty({ description: 'vehicleModel ID field' })
    vehicleModelId: number;

    @IsOptional()
    @ApiModelProperty({ description: 'licenseLink ID field' })
    licenseLink: string;

    @IsOptional()
    @ApiModelProperty({ description: 'pictureLink ID field' })
    pictureLink: string;
}
