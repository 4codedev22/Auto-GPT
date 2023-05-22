/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsDate, IsOptional } from 'class-validator';

import { ReservationStatus } from '../../domain/enumeration/reservation-status';
import { Type } from 'class-transformer';


export class AlertReportFilterDTO {
    @IsOptional()
    @MaxLength(20)
    @ApiModelProperty({ description: 'licensePlate field', required: false })
    licensePlate: string;

    @IsOptional()
    @ApiModelProperty({ description: 'alert field' })
    alert: string;


    @IsOptional()
    @ApiModelProperty({ description: 'model field' })
    model: string;


    @IsOptional()
    @ApiModelProperty({ description: 'status field' })
    status: number;


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
