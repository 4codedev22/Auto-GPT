/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { VehicleDTO } from './vehicle.dto';
import { ContractDTO } from './contract.dto';

/**
 * A VehicleGroupDTO object.
 */
export class VehicleGroupCreateDTO {
    @MaxLength(255)
    @ApiModelProperty({ description: 'name field', required: false })
    name: string;
}
