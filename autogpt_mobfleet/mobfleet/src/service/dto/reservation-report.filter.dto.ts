/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsDate, IsOptional } from 'class-validator';

import { ReservationStatus } from '../../domain/enumeration/reservation-status';
import { Type } from 'class-transformer';

/**
 * A ReservationDTO object.
 */
export class ReservationReportFilterDTO {
    @IsOptional()
    @MaxLength(20)
    @ApiModelProperty({ description: 'licensePlate field', required: false })
    licensePlate: string;

    @IsOptional()
    @ApiModelProperty({ description: 'userEmail field' })
    userEmail: string;


    @IsOptional()
    @ApiModelProperty({ description: 'initialDate field', required: false })
    @Type(() => Date)
    @IsDate()
    initialDate: Date;


    @IsOptional()
    @ApiModelProperty({ description: 'finalDate field', required: false })
    @Type(() => Date)
    @IsDate()
    finalDate: Date;
}
