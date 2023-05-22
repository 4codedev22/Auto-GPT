/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';
import { DamageType } from '../../domain/enumeration/damage-type';

/**
 * A DamageCreateDTO object.
 */
export class DamageCreateDTO {
    @ApiModelProperty({ description: 'damage_imagese field', required: false })
    damageImages: string[];

    @MaxLength(255)
    @ApiModelProperty({ description: 'title field', required: false })
    title: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @ApiModelProperty({ description: 'impeditive field', required: false })
    impeditive: boolean;

    @ApiModelProperty({ isArray: true, description: 'contracts relationship' })
    contracts: number[];

    @ApiModelProperty({ description: 'vehicle relationship' })
    vehicle: number;

    @ApiModelProperty({ description: 'account relationship' })
    account: number;

    @ApiModelProperty({ description: 'reservation relationship' })
    reservation: number;

    @ApiModelProperty({ type: DamageType, description: 'reservation relationship' })
    type: DamageType;
}
