/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ReservationDTO } from './reservation.dto';
import { VehicleDTO } from './vehicle.dto';

/**
 * A RatingDTO object.
 */
export class RatingDTO extends BaseDTO {
    @ApiModelProperty({ description: 'value field', required: false })
    value: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'message field', required: false })
    message: string;

    @ApiModelProperty({ type: ReservationDTO, description: 'reservation relationship' })
    reservation: ReservationDTO;

    @ApiModelProperty({ type: VehicleDTO, description: 'vehicle relationship' })
    vehicle: VehicleDTO;
}
