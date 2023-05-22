/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A RpushFeedbackDTO object.
 */
export class RpushFeedbackDTO extends BaseDTO {
    @MaxLength(255)
    @ApiModelProperty({ description: 'deviceToken field', required: false })
    deviceToken: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'failedAt field' })
    failedAt: any;

    @ApiModelProperty({ description: 'appId field', required: false })
    appId: number;
}
