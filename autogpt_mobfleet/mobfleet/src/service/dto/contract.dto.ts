/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { BaseDTO } from './base.dto';

import { CompanyDTO } from './company.dto';
import { VehicleGroupDTO } from './vehicle-group.dto';
import { LocationDTO } from './location.dto';
import { AccountDTO } from './account.dto';
import { CommandDTO } from './command.dto';
import { DamageDTO } from './damage.dto';
import { VehicleDTO } from './vehicle.dto';
import { ContractStatus } from '../../domain/enumeration/contract-status';
import { Exclude, Expose } from 'class-transformer';

/**
 * A ContractDTO object.
 */
export class ContractDTO extends BaseDTO {
  @ApiModelProperty({ description: 'uuid field' })
  uuid: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiModelProperty({ description: 'name field' })
  name: string;

  @IsOptional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'supportPhone field' })
  supportPhone: string;

  @IsOptional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'supportEmail field' })
  supportEmail: string;

  @IsOptional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'supportWhatsappNumber field' })
  supportWhatsappNumber: string;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'status field' })
  status: ContractStatus;

  @Exclude({ toPlainOnly: true })
  @MaxLength(255)
  @ApiModelProperty({ description: 'clientToken field', required: false })
  clientToken: string;

  @Exclude({ toPlainOnly: true })
  @MaxLength(255)
  @ApiModelProperty({ description: 'secretToken field', required: false })
  secretToken: string;

  @ApiModelProperty({ type: CompanyDTO, description: 'company relationship' })
  company: CompanyDTO;

  @ApiModelProperty({ type: VehicleGroupDTO, isArray: true, description: 'vehicleGroups relationship' })
  vehicleGroups: VehicleGroupDTO[];

  @ApiModelProperty({ type: LocationDTO, isArray: true, description: 'locations relationship' })
  locations: LocationDTO[];

  @ApiModelProperty({ type: AccountDTO, isArray: true, description: 'accounts relationship' })
  accounts: AccountDTO[];

  @ApiModelProperty({ type: CommandDTO, isArray: true, description: 'commands relationship' })
  commands: CommandDTO[];

  @ApiModelProperty({ type: DamageDTO, isArray: true, description: 'damages relationship' })
  damages: DamageDTO[];

  @ApiModelProperty({ type: VehicleDTO, isArray: true, description: 'vehicles relationship' })
  vehicles: VehicleDTO[];


  @Expose({ name: 'canRunCommand' })
  private getcanRunCommand?() {
    return !!this.clientToken && !!this.secretToken;
  }
}
