/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches, min } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ChargeTableDTO } from './charge-table.dto';


/**
 * A ChargeConditionDTO object.
 */
export class ChargeConditionDTO extends BaseDTO {

    @IsNotEmpty()
    @ApiModelProperty({ description: 'executeChargeFrom field' })
    executeChargeFrom: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'executeChargeTo field' })
    executeChargeTo: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'chargeValueCents field' })
    chargeValueCents: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'minChargeUnit field' })
    minChargeUnit: number;
    
    @IsNotEmpty()
    @Min(1)
    @ApiModelProperty({ description: 'additionalChargeUnit field' })
    additionalChargeUnit: number;


    @ApiModelProperty({ type: ChargeTableDTO, description: 'chargeTable relationship' })
    @Type(() => ChargeTableDTO)
    chargeTable: ChargeTableDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
