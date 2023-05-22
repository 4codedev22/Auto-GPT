/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AccountDTO } from './account.dto';

/**
 * A SmsTokenDTO object.
 */
export class SmsTokenDTO extends BaseDTO {
    @MaxLength(255)
    @ApiModelProperty({ description: 'token field', required: false })
    token: string;

    @ApiModelProperty({ description: 'expiration field', required: false })
    expiration: any;

    @MaxLength(255)
    @ApiModelProperty({ description: 'mode field', required: false })
    mode: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'receiver field', required: false })
    receiver: string;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;
}
