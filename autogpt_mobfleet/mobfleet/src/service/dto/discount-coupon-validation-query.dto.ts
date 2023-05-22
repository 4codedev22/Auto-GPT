/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DiscountCouponValidationDTO {

    @IsNotEmpty()
    @ApiModelProperty({ description: 'name field', required: true })
    couponName: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'reservation value', required: true })
    reservationValue: number;

    @ApiModelProperty({ description: 'reservation date' })
    reservationDate: string;
}
