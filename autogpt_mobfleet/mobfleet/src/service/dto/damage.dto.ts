/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ContractDTO } from './contract.dto';
import { VehicleDTO } from './vehicle.dto';
import { AccountDTO } from './account.dto';
import { ReservationDTO } from './reservation.dto';
import { DamageType } from '../../domain/enumeration/damage-type';

/**
 * A DamageDTO object.
 */
export class DamageDTO extends BaseDTO {
    @ApiModelProperty({ description: 'active field', required: false })
    solved: boolean;

    @ApiModelProperty({ description: 'solver field', required: false })
    solver: AccountDTO;

    @ApiModelProperty({ description: 'damage_imagese field', required: false })
    damageImages: string[];

    @ApiModelProperty({ description: 'solution_images field', required: false })
    solutionImages: string[];

    @ApiModelProperty({ description: 'solution_images field', required: false })
    solutionComment: string;

    @ApiModelProperty({ description: 'solved_at field', required: false })
    solvedAt: any;

    @ApiModelProperty({ description: 'deletedAt field', required: false })
    deletedAt: any;

    @MaxLength(255)
    @ApiModelProperty({ description: 'title field', required: false })
    title: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @ApiModelProperty({ description: 'impeditive field', required: false })
    impeditive: boolean;

    @ApiModelProperty({ type: ContractDTO, description: 'contract relationship' })
    contract: ContractDTO;

    @ApiModelProperty({ type: VehicleDTO, description: 'vehicle relationship' })
    vehicle: VehicleDTO;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;

    @ApiModelProperty({ type: ReservationDTO, description: 'reservation relationship' })
    reservation: ReservationDTO;

    @ApiModelProperty({ type: DamageType, description: 'reservation relationship' })
    type: DamageType;
}
