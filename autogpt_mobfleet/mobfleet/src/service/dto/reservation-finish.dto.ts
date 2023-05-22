
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';


/**
 * A ReservationDTO object.
 */
export class ReservationFinishDTO {
    @IsOptional()
    @ApiModelProperty({ description: 'latitude field', required: false })
    latitude: number;

    @IsOptional()
    @ApiModelProperty({ description: 'longitude field', required: false })
    longitude: number;

    @IsOptional()
    @ApiModelProperty({ description: 'odometerKm field', required: false })
    odometerKm: number;

    @IsOptional()
    @ApiModelProperty({ description: 'fuelLevel field', required: false })
    fuelLevel: number;
}
