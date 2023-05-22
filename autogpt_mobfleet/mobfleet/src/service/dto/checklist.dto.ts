/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { VehicleDTO } from './vehicle.dto';
import { AccountDTO } from './account.dto';
import { ReservationDTO } from './reservation.dto';

/**
 * A ChecklistDTO object.
 */
export class ChecklistDTO extends BaseDTO {
    @MaxLength(255)
    @ApiModelProperty({ description: 'answers field', required: false })
    answers: string;

    @ApiModelProperty({ description: 'item1 field', required: false })
    item1: boolean;

    @ApiModelProperty({ description: 'item2 field', required: false })
    item2: boolean;

    @ApiModelProperty({ description: 'item3 field', required: false })
    item3: boolean;

    @ApiModelProperty({ description: 'item4 field', required: false })
    item4: boolean;

    @ApiModelProperty({ description: 'item5 field', required: false })
    item5: boolean;

    @ApiModelProperty({ description: 'item6 field', required: false })
    item6: boolean;

    @ApiModelProperty({ description: 'item7 field', required: false })
    item7: boolean;

    @ApiModelProperty({ description: 'item8 field', required: false })
    item8: boolean;

    @ApiModelProperty({ description: 'item9 field', required: false })
    item9: boolean;

    @ApiModelProperty({ description: 'item10 field', required: false })
    item10: boolean;

    @ApiModelProperty({ description: 'item11 field', required: false })
    item11: boolean;

    @ApiModelProperty({ description: 'item12 field', required: false })
    item12: boolean;

    @ApiModelProperty({ description: 'item13 field', required: false })
    item13: boolean;

    @ApiModelProperty({ description: 'item14 field', required: false })
    item14: boolean;

    @ApiModelProperty({ description: 'item15 field', required: false })
    item15: boolean;

    @MaxLength(255)
    @ApiModelProperty({ description: 'pictures field', required: false })
    pictures: string;

    @ApiModelProperty({ type: VehicleDTO, description: 'vehicle relationship' })
    vehicle: VehicleDTO;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;

    @ApiModelProperty({ type: ReservationDTO, description: 'reservation relationship' })
    reservation: ReservationDTO;
}
