/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * A AccountBlockDTO object.
 */
export class AccountBlockDTO {
    @ApiModelProperty({ description: 'reason field', required: true })
    reason: string;
}
