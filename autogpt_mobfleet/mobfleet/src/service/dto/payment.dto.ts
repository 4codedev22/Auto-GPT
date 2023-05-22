/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Account } from 'src/domain/account.entity';
import { Contract } from 'src/domain/contract.entity';
import { PaymentMethodType } from 'src/domain/enumeration/payment-method-type';
import { Reservation } from 'src/domain/reservation.entity';

/**
 * A PaymentDTO object.
 */
export class PaymentDTO {
    @ApiModelProperty({ description: 'card id'})
    cardId: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'charge description', required: true })
    description: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'charge value in cents', required: true })
    valueCents: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'charge payment method', required: true })
    paymentMethod: PaymentMethodType;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'reservation', required: true })
    reservation: Reservation;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'creator account', required: true })
    creator: Account;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'Contract', required: true })
    contract: Contract;
}
