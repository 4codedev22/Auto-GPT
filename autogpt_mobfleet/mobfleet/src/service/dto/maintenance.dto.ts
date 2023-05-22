/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { VehicleDTO } from './vehicle.dto';
import { AccountDTO } from './account.dto';

/**
 * A MaintenanceDTO object.
 */
export class MaintenanceDTO extends BaseDTO {
    @ApiModelProperty({ description: 'type field', required: false })
    type: number;

    @MaxLength(512)
    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @ApiModelProperty({ description: 'odometerKm field', required: false })
    odometerKm: number;

    @ApiModelProperty({ type: VehicleDTO, description: 'vehicle relationship' })
    vehicle: VehicleDTO;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;
}
