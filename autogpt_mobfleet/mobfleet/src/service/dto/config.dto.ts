/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A ConfigDTO object.
 */
export class ConfigDTO extends BaseDTO {
    @ApiModelProperty({ description: 'contractId field', required: false })
    contractId: number;

    @ApiModelProperty({ description: 'companyId field', required: false })
    companyId: number;

    @MaxLength(320)
    @ApiModelProperty({ description: 'name field', required: false })
    name: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'value field', required: false })
    value: string;
}
