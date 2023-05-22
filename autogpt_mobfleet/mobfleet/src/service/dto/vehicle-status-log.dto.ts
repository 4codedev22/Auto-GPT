/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { VehicleDTO } from './vehicle.dto';
import { AccountDTO } from './account.dto';
import { VehicleStatus } from '../../domain/enumeration/vehicle-status';

/**
 * A VehicleStatusLogDTO object.
 */
export class VehicleStatusLogDTO extends BaseDTO {
  @ApiModelProperty({ description: 'status field', required: false })
  status: VehicleStatus;

    @ApiModelProperty({ type: VehicleDTO, description: 'vehicle relationship' })
    vehicle: VehicleDTO;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    createdBy: AccountDTO;

    @ApiModelProperty({ description: 'reason field', required: false })
    reason: string;

}
