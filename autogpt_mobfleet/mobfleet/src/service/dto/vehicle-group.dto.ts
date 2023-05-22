/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { VehicleDTO } from './vehicle.dto';
import { ContractDTO } from './contract.dto';
import { AccountDTO } from './account.dto';

/**
 * A VehicleGroupDTO object.
 */
export class VehicleGroupDTO extends BaseDTO {
    @MaxLength(255)
    @ApiModelProperty({ description: 'name field', required: false })
    name: string;

    @ApiModelProperty({ type: VehicleDTO, isArray: true, description: 'vehicles relationship' })
    vehicles: VehicleDTO[];

    @ApiModelProperty({ type: ContractDTO, isArray: true, description: 'contracts relationship' })
    contracts: ContractDTO[];

    @ApiModelProperty({ type: AccountDTO, isArray: true, description: 'contracts relationship' })
    accounts: AccountDTO[];
}
