/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ContractDTO } from './contract.dto';
import { CommandLogDTO } from './command-log.dto';
import { AvailableCommands } from '../../domain/enumeration/available-commands';

/**
 * A CommandDTO object.
 */
export class CommandDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'commandCode field' })
    commandCode: number;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'name field', enum: AvailableCommands })
    name: AvailableCommands;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'ttl field' })
    ttl: number;

    @ApiModelProperty({ type: ContractDTO, isArray: true, description: 'contracts relationship' })
    contracts: ContractDTO[];

    @ApiModelProperty({ type: CommandLogDTO, isArray: true, description: 'commandLogs relationship' })
    commandLogs: CommandLogDTO[];
}
