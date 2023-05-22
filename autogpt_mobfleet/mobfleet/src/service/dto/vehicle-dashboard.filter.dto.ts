/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleStatus } from '../../domain/enumeration/vehicle-status';

export class VehicleDashboardFilterDTO {
    

    @IsOptional()
    @ApiModelProperty({ description: 'vehicleModel relationship' })
    vehicleModelId: number;

    @IsOptional()
    @ApiModelProperty({ description: 'hotspot relationship' })
    hostpotId: number;

    @IsOptional()
    @ApiModelProperty({ description: 'date field', required: false })
    @Type(() => Date)
    @IsDate()
    date: Date;
}
