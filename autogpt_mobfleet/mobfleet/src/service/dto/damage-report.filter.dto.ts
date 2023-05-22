/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationType } from '../../domain/enumeration/reservation-type';

export class DamageReportFilterDTO {
    @IsOptional()
    @ApiModelProperty({ description: 'id field', required: false })
    id?: number;

    @IsOptional()
    @MaxLength(20)
    @ApiModelProperty({ description: 'licensePlate field', required: false })
    licensePlate?: string;

    @IsOptional()
    @ApiModelProperty({ description: 'userEmail field' })
    userEmail?: string;

    @IsOptional()
    @ApiModelProperty({ description: 'type field' })
    reservationType?: ReservationType;


    @IsOptional()
    @ApiModelProperty({ description: 'initialDate field', required: false })
    @Type(() => Date)
    @IsDate()
    initialDate?: Date;


    @IsOptional()
    @ApiModelProperty({ description: 'finalDate field', required: false })
    @Type(() => Date)
    @IsDate()
    finalDate?: Date;
}
