/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * A AlertDTO object.
 */
export class CardDTO {
    @ApiModelProperty({ description: 'id field', required: false })
    id: string;

    @ApiModelProperty({ description: 'firstSixDigits field', required: false })
    firstSixDigits: string;

    @ApiModelProperty({ description: 'lastFourDigits field', required: false })
    lastFourDigits: string;

    @ApiModelProperty({ description: 'brand field', required: false })
    brand: string;

    @ApiModelProperty({ description: 'holderName relationship', required: false })
    holderName: string;

    @ApiModelProperty({ description: 'holderDocument relationship', required: false })
    holderDocument: string;

    @ApiModelProperty({ description: 'expMonth relationship', required: false })
    expMonth: number;

    @ApiModelProperty({ description: 'expYear relationship', required: false })
    expYear: number;

    @ApiModelProperty({ description: 'status relationship', required: false })
    status: string;

    @ApiModelProperty({ description: 'type relationship', required: false })
    type: string;

    @ApiModelProperty({ description: 'label relationship', required: false })
    label: string;

    @ApiModelProperty({ description: 'createdAt relationship', required: false })
    createdAt: string;

    @ApiModelProperty({ description: 'updatedAt relationship', required: false })
    updatedAt: string;
}
