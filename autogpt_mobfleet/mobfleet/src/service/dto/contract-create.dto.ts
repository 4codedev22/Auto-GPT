/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { CompanyDTO } from './company.dto';
import { VehicleGroupDTO } from './vehicle-group.dto';
import { LocationDTO } from './location.dto';
import { AccountDTO } from './account.dto';
import { CommandDTO } from './command.dto';
import { DamageDTO } from './damage.dto';
import { VehicleDTO } from './vehicle.dto';
import { ContractStatus } from '../../domain/enumeration/contract-status';

/**
 * A ContractDTO object.
 */
export class ContractCreateDTO extends BaseDTO {
    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'name field' })
    name: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'status field' })
    status: ContractStatus;

    @ApiModelProperty({ description: 'company relationship' })
    company: number;
}
