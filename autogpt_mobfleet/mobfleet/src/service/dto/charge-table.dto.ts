/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseDTO } from './base.dto';


import { VehicleGroupDTO } from './vehicle-group.dto';
import { ContractDTO } from './contract.dto';
import { ChargeUnit } from '../../domain/enumeration/charge-unit';
import { ChargeConditionDTO } from './charge-condition.dto';
import { Type } from 'class-transformer';


/**
 * A ChargeTableDTO object.
 */
export class ChargeTableDTO extends BaseDTO {

  @IsNotEmpty()
  @MaxLength(255)
  @ApiModelProperty({ description: 'name field' })
  name: string;

  @IsNotEmpty()
  @MaxLength(10)
  @ApiModelProperty({ description: 'currency field' })
  currency: string;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'initialChargeCents field' })
  initialChargeCents: number;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'depositCents field' })
  depositCents: number;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'fuelPriceCents field' })
  fuelPriceCents: number;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'fuelTolerance field' })
  fuelTolerance: number;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'odometerPriceCents field' })
  odometerPriceCents: number;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'startAt field' })
  startAt: any;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'endAt field' })
  endAt: any;

  @ApiModelProperty({ enum: ChargeUnit, description: 'chargeUnit enum field', required: false })
  chargeUnit: ChargeUnit;


  @ApiModelProperty({ type: VehicleGroupDTO, description: 'vehicleGroup relationship' })
  vehicleGroup: VehicleGroupDTO;

  @ApiModelProperty({ type: ContractDTO, description: 'contract relationship' })
  contract: ContractDTO;


  @ApiModelProperty({ type: ChargeConditionDTO, isArray: true, description: 'charge conditions relationship' })
  @Type(() => ChargeConditionDTO)
  chargeConditions: ChargeConditionDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
