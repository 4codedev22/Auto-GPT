/* eslint-disable @typescript-eslint/no-unused-vars */
import { Optional } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ContractDTO } from './contract.dto';

/**
 * A CompanyDTO object.
 */
export class CompanyDTO extends BaseDTO {
  @Optional()
  @ApiModelProperty({ description: 'uuid field' })
  uuid: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiModelProperty({ description: 'name field' })
  name: string;

  @Optional()
  @ApiModelProperty({ type: ContractDTO, isArray: true, description: 'contracts relationship' })
  contracts: ContractDTO[];

  @ApiModelProperty({ description: 'Payment Elabled field' })
  paymentEnabled: boolean;

  @ApiModelProperty({ description: 'Payment Descriptor field' })
  paymentDescriptor: string;

  @Optional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'Payment Public Key field' })
  paymentPublicKey: string;

  @Optional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'Payment Secret Key field' })
  paymentSecretKey: string;
}
