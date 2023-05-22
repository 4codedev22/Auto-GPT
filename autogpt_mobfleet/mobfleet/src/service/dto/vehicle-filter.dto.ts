import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { VehicleStatus } from 'src/domain/enumeration/vehicle-status';
import { ContractStatus } from '../../domain/enumeration/contract-status';

export class VehicleFilterDTO {
  @IsOptional()
  @ApiModelProperty({ description: 'id field'})
  id?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'licensePlate field'})
  licensePlate?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'hotspot where vehicle is located' })
  hotspot?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'vehicleGroup' })
  vehicleGroup?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'Vehicle status', enum: ContractStatus })
  status?: VehicleStatus | VehicleStatus[];

  @IsOptional()
  @ApiModelProperty({ description: 'search name'})
  search?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'select fields. Some fields are not selectable: id, licensePlate, currentVehicleState, isOnline'})
  fields?: string;
}
