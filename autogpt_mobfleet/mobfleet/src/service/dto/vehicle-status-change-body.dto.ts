/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


/**
 * A VehicleDTO object.
 */
export class VehicleStatusChangeBodyDTO {

  @IsNotEmpty()
  @ApiModelProperty({ description: 'reason field', required: true })
  reason: string;
}
