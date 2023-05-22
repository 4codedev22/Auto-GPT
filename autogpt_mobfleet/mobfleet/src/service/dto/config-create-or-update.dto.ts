/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * A ConfigCreateOrUpdateDTO object.
 */
export class ConfigCreateOrUpdateDTO {
    @ApiModelProperty({ description: 'contractId field' })
    contractId: number;

    @ApiModelProperty({ description: 'configs field' })
    configs: any;

}
