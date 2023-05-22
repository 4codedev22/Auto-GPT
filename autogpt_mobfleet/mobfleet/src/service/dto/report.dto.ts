/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { AccountDTO } from './account.dto';


/**
 * A ReportDTO object.
 */
export class ReportDTO extends BaseDTO {

    @ApiModelProperty({ description: 'uuid field' })
    uuid: string;

    @ApiModelProperty({ description: 'fileName field' })
    fileName: string;
    @ApiModelProperty({ description: 'entityName field' })
    entityName: string;

    @ApiModelProperty({ description: 'url field' })
    url: string;

    @ApiModelProperty({ description: 'isEmpty field' })
    isEmpty: boolean;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
