/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { VehicleStatus } from '../../domain/enumeration/vehicle-status';
import { TypeFuel } from '../../domain/enumeration/type-fuel';


export class VehicleMinimalDTO {

    @IsOptional()
    @ApiModelProperty({ description: 'id field', required: false })
    id?: number;

    @IsOptional()
    @ApiModelProperty({ description: 'licensePlate field', required: false })
    licensePlate?: string;

    @IsOptional()
    @ApiModelProperty({ description: 'latitude field', required: false })
    latitude?: number;

    @IsOptional()
    @ApiModelProperty({ description: 'longitude field', required: false })
    longitude?: number;

    @IsOptional()
    @ApiModelProperty({ description: 'fuelLevel field', required: false })
    fuelLevel?: number;

    @IsOptional()
    @ApiModelProperty({ description: 'evBatteryLevel field', required: false })
    evBatteryLevel?: number;

    @ApiModelProperty({ description: 'typeFuel field', required: false })
    typeFuel?: TypeFuel;


    @IsOptional()
    @ApiModelProperty({ description: 'batteryVolts field', required: false })
    batteryVolts?: number;

    @IsOptional()
    @ApiModelProperty({ description: 'ignitionStatus field', required: false })
    ignitionStatus?: boolean;

    @IsOptional()
    @ApiModelProperty({ description: 'status field', required: false })
    status?: VehicleStatus;
}
