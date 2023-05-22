/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches, IsOptional } from 'class-validator';
import { BaseDTO } from './base.dto';

import { VehicleManufacturerDTO } from './vehicle-manufacturer.dto';
import { VehicleDTO } from './vehicle.dto';

/**
 * A VehicleModelDTO object.
 */
export class VehicleModelUpdateDTO {
  @IsOptional()
  @MaxLength(50)
  @ApiModelProperty({ description: 'name field', required: false })
  name?: string;

  @ApiModelProperty({ description: 'type field', required: false })
  @IsOptional()
  type?: number;

  @ApiModelProperty({ description: 'maintenanceKm field', required: false })
  @IsOptional()
  maintenanceKm?: number;

  @ApiModelProperty({ description: 'maintenanceMonths field', required: false })
  @IsOptional()
  maintenanceMonths?: number;

  @ApiModelProperty({ description: 'vehicleManufacturer relationship' })
  @IsOptional()
  vehicleManufacturer?: number;
}
