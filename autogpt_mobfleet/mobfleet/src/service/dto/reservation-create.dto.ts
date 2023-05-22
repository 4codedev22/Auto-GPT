
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsOptional } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A ReservationDTO object.
 */
export class ReservationCreateDTO extends BaseDTO {
    @ApiModelProperty({ description: 'dateWithdrawal field', required: false })
    dateWithdrawal: any;

    @ApiModelProperty({ description: 'originLocation field', required: false })
    originLocation: number;

    @ApiModelProperty({ description: 'dateDevolution field', required: false })
    dateDevolution: any;

    @ApiModelProperty({ description: 'devolutionLocation field', required: false })
    devolutionLocation: number;

    @ApiModelProperty({ description: 'destinyLocation field', required: false })
    destinyLocation: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'destiny field', required: false })
    destiny: string;

    @MaxLength(255)
    @IsOptional()
    @ApiModelProperty({ description: 'destinyNickname field', required: false })
    destinyNickname: string;

    @ApiModelProperty({ description: 'destinyLatitude field', required: false })
    destinyLatitude: number;

    @ApiModelProperty({ description: 'destinyLongitude field', required: false })
    destinyLongitude: number;

    @ApiModelProperty({ description: 'destinyDateAndTime field', required: false })
    destinyDateAndTime: any;

    @ApiModelProperty({ description: 'vehicle relationship' })
    vehicleId: number;

    @ApiModelProperty({ description: 'account relationship', required: false })
    accountId: number;

    @ApiModelProperty({ isArray: true, description: 'reservationAccounts relationship' })
    reservationAccounts: number[];

    @IsOptional()
    @ApiModelProperty({ description: 'selectedCardId field', required: false })
    selectedCardId: string;

    @IsOptional()
    @ApiModelProperty({ description: 'coupon field', required: false })
    coupon: string;

}
