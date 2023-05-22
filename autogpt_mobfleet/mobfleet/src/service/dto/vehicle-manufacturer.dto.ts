/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { VehicleModelDTO } from './vehicle-model.dto';

/**
 * A VehicleManufacturerDTO object.
 */
export class VehicleManufacturerDTO extends BaseDTO {
    @MaxLength(255)
    @ApiModelProperty({ description: 'name field', required: false })
    name: string;

    @ApiModelProperty({ type: VehicleModelDTO, isArray: true, description: 'vehicleModels relationship' })
    vehicleModels: VehicleModelDTO[];
}
