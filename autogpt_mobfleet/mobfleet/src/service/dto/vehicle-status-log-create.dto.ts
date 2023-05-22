/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches, IsOptional } from 'class-validator';
import { BaseDTO } from './base.dto';

import { VehicleDTO } from './vehicle.dto';
import { AccountDTO } from './account.dto';
import { VehicleStatus } from '../../domain/enumeration/vehicle-status';

/**
 * A VehicleStatusLogCreateDTO object.
 */
export class VehicleStatusLogCreateDTO {
  @ApiModelProperty({ description: 'status field', required: false })
  status: VehicleStatus;
  @ApiModelProperty({ description: 'vehicle relationship' })
  vehicle_id: number;

  @ApiModelProperty({ description: 'account relationship' })
  created_by: number;

  @IsOptional()
  @ApiModelProperty({ description: 'reason field', required: false })
  reason: string;
}
