/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ContractDTO } from './contract.dto';
import { ReservationDTO } from './reservation.dto';
import { ChargeStatus } from '../../domain/enumeration/charge-status';
import { OrderStatus } from '../../domain/enumeration/order-status';
import { ChargeType } from '../../domain/enumeration/charge-type';
import { PaymentMethodType } from '../../domain/enumeration/payment-method-type';

/**
 * A ChargeDTO object.
 */
export class ChargeDTO extends BaseDTO {

  @IsOptional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'description field' })
  description: string;

  @IsNotEmpty()
  @MaxLength(50)
  @ApiModelProperty({ description: 'payment method field', enum: PaymentMethodType })
  paymentMethod: PaymentMethodType;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'valueCents field' })
  valueCents: number;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'type field' })
  type: ChargeType;

  @IsOptional()
  @ApiModelProperty({ description: 'createdBy field' })
  createdBy: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiModelProperty({ description: 'selectedCardId field' })
  selectedCardId: string;

  @IsNotEmpty()
  @MaxLength(4)
  @ApiModelProperty({ description: 'cardLastFour field' })
  cardLastFour: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiModelProperty({ description: 'cardBrand field' })
  cardBrand: string;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'chargeInfo field' })
  chargeInfo: any;

  @ApiModelProperty({ enum: ChargeStatus, description: 'ChargeStatus enum field', required: false })
  chargeStatus: ChargeStatus;

  @ApiModelProperty({ enum: OrderStatus, description: 'OrderStatus enum field', required: false })
  orderStatus: OrderStatus;

  @ApiModelProperty({ type: ReservationDTO, description: 'reservation relationship' })
  reservation: ReservationDTO;

  @ApiModelProperty({ type: ContractDTO, description: 'contract relationship' })
  contract: ContractDTO;

}
