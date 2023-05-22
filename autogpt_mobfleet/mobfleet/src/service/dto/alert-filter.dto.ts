/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * A AlertFilterDTO object.
 */

export class AlertFilterDTO {
    @IsOptional()
    @ApiModelProperty({ description: 'searchGroupAndType', required: false })
    searchGroupAndType: string;

    @IsOptional()
    @ApiModelProperty({ description: 'status', required: false })
    status: "1" | "0";

    @IsNotEmpty()
    @ApiModelProperty({ description: 'vehicleIdentifier', required: false })
    vehicleIdentifier: string;    
}
