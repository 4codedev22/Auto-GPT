/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AccountDTO } from './account.dto';

/**
 * A RoleDTO object.
 */
export class RoleDTO extends BaseDTO {
    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'name field' })
    name: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'authorizableType field', required: false })
    authorizableType: string;

    @ApiModelProperty({ description: 'authorizableId field', required: false })
    authorizableId: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'system field' })
    system: boolean;

    @ApiModelProperty({ description: 'defaultFlags field', required: false })
    defaultFlags: string;

    @ApiModelProperty({ type: AccountDTO, isArray: true, description: 'accounts relationship' })
    accounts: AccountDTO[];
}
