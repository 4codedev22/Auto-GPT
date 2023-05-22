/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { CommandDTO } from './command.dto';
import { VehicleDTO } from './vehicle.dto';
import { AccountDTO } from './account.dto';
import { CommandStatus } from '../../domain/enumeration/command-status';

/**
 * A CommandLogDTO object.
 */
export class CommandLogSimpleDTO {
    @ApiModelProperty({ description: 'status field', type: CommandStatus })
    status?: CommandStatus;

    @ApiModelProperty({ description: 'executedAt field' })
    executedAt?: any;

    @ApiModelProperty({ description: 'command relationship' })
    command?: string;

    @ApiModelProperty({ type: VehicleDTO, description: 'vehicle relationship' })
    vehicleId?: number;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    accountId?: number;
}
