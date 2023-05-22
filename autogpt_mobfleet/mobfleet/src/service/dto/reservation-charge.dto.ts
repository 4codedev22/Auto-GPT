/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaymentMethodType } from '../../domain/enumeration/payment-method-type';

/**
 * A ReservationChargeDTO object.
 */
export class ReservationChargeDTO {
    @ApiModelProperty({ description: 'card id'})
    cardId: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'charge description', required: true })
    description: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'charge value in cents', required: true })
    valueCents: number;

    @IsNotEmpty()
    @ApiModelProperty({ enum: PaymentMethodType, description: 'charge payment method', required: true })
    paymentMethod: PaymentMethodType;
}
