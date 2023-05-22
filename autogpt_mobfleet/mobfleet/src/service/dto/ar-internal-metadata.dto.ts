/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A ArInternalMetadataDTO object.
 */
export class ArInternalMetadataDTO extends BaseDTO {
    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'key field' })
    key: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'value field', required: false })
    value: string;
}
