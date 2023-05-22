/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsDate, IsOptional } from 'class-validator';

import { ReservationStatus } from '../../domain/enumeration/reservation-status';
import { Type } from 'class-transformer';

/**
 * A ReservationDTO object.
 */
export class ReservationCalendarFilterDTO {
    @IsOptional()
    @MaxLength(20)
    @ApiModelProperty({ description: 'licensePlate field', required: false })
    licensePlate: string;

    @IsOptional()
    @ApiModelProperty({ description: 'vehicleModel relationship' })
    vehicleModelId: number;

    @IsOptional()
    @ApiModelProperty({ description: 'hotspot relationship' })
    hostpotId: number;

    @IsOptional()
    @ApiModelProperty({ description: 'status field', required: false })
    status: ReservationStatus;

    @IsOptional()
    @ApiModelProperty({ description: 'date field', required: false })
    @Type(() => Date)
    @IsDate()
    date: Date;
}
