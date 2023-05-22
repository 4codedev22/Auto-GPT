/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { DamageDTO } from './damage.dto';
import { AccountDTO } from './account.dto';
import { VehicleDTO } from './vehicle.dto';
import { AlertDTO } from './alert.dto';
import { ChecklistDTO } from './checklist.dto';
import { RatingDTO } from './rating.dto';
import { ReservationAccountDTO } from './reservation-account.dto';
import { ReservationStatus } from '../../domain/enumeration/reservation-status';
import { CancellationReason } from '../../domain/enumeration/cancellation-reason';
import { Location } from '../../domain/location.entity';

/**
 * A ReservationDTO object.
 */
export class ReservationCreateV1DTO {
    @MaxLength(255)
    @ApiModelProperty({ description: 'destiny field', required: false })
    destiny: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'destinyNickname field', required: false })
    destiny_nickname: string;

    @ApiModelProperty({ description: 'destinyLatitude field', required: false })
    destiny_latitude: number;

    @ApiModelProperty({ description: 'destinyLongitude field', required: false })
    destiny_longitude: number;

    @ApiModelProperty({ description: 'dateWithdrawal field', required: false })
    date_withdrawal: any;

    @ApiModelProperty({ description: 'dateDevolution field', required: false })
    date_devolution: any;

    @ApiModelProperty({ description: 'originLocation field', required: false })
    origin_location_id: number;

    @ApiModelProperty({ description: 'devolutionLocation field', required: false })
    devolution_location_id: number;

    @ApiModelProperty({ description: 'account relationship' })
    account_id: number;

    @ApiModelProperty({ description: 'vehicle relationship' })
    vehicle_id: number;
}
