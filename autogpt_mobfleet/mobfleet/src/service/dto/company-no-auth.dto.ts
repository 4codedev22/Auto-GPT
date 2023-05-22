/* eslint-disable @typescript-eslint/no-unused-vars */
import { Optional } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

import { ContractNoAuthDTO } from './contract-no-auth.dto';

/**
 * A CompanyNoAuthDTO object.
 */
export class CompanyNoAuthDTO {
  id?: number;

  @Optional()
  @ApiModelProperty({ description: 'uuid field' })
  uuid: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiModelProperty({ description: 'name field' })
  name: string;

  @Optional()
  @ApiModelProperty({ type: ContractNoAuthDTO, isArray: true, description: 'contracts relationship' })
  contracts: ContractNoAuthDTO[];
}
