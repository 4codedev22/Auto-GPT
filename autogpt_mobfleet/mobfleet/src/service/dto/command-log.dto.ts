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
export class CommandLogDTO extends BaseDTO {
    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'jobIdentifier field' })
    jobIdentifier: string;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'status field', type: CommandStatus })
    status: CommandStatus;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'executedAt field' })
    executedAt: any;

    @ApiModelProperty({ type: CommandDTO, description: 'command relationship' })
    command: CommandDTO;

    @ApiModelProperty({ type: VehicleDTO, description: 'vehicle relationship' })
    vehicle: VehicleDTO;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;
}
