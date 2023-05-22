/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A RatingDTO object.
 */
export class RatingReservationCreateDTO extends BaseDTO {
    @ApiModelProperty({ description: 'value field', required: false })
    value: number;

    @IsOptional()
    @MaxLength(255)
    @ApiModelProperty({ description: 'message field', required: false })
    message: string;
}
