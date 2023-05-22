import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A MaintenanceReservationCreateDTO object.
 */
export class MaintenanceReservationCreateDTO extends BaseDTO {
    @ApiModelProperty({ description: 'vehicleId field' })
    vehicleId: number;
}
