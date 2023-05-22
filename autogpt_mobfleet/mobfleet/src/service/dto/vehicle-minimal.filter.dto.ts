/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleStatus } from '../../domain/enumeration/vehicle-status';

/**
 * A VehicleCalendarFilterDTO object.
 */
export class VehicleMinimalFilterDTO {
    @IsOptional()
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
    status: VehicleStatus;
}
