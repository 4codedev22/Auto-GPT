/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AccountDTO } from './account.dto';
import { ReservationDTO } from './reservation.dto';

/**
 * A ReservationAccountDTO object.
 */
export class ReservationAccountDTO extends BaseDTO {
    @ApiModelProperty({ description: 'status field', required: false })
    status: boolean;

    @MaxLength(255)
    @ApiModelProperty({ description: 'message field', required: false })
    message: string;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;

    @ApiModelProperty({ type: ReservationDTO, description: 'reservation relationship' })
    reservation: ReservationDTO;
}
