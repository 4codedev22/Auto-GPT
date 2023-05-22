/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { OpenningHours } from '../../domain/openning-hours.entity';
import { LocationType } from '../../domain/enumeration/location-type';
import { BaseDTO } from './base.dto';

import { ContractDTO } from './contract.dto';
import { Type } from 'class-transformer';

/**
 * A LocationDTO object.
 */
export class LocationDTO extends BaseDTO {
    @MaxLength(512)
    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @MaxLength(128)
    @ApiModelProperty({ description: 'address field', required: false })
    address: string;

    @ApiModelProperty({ description: 'latitude field', required: false })
    latitude: number;

    @ApiModelProperty({ description: 'longitude field', required: false })
    longitude: number;

    @ApiModelProperty({ description: 'radiusM field', required: false })
    radiusM: number;

    @ApiModelProperty({ description: 'type field', required: false })
    type: LocationType;

    @MaxLength(255)
    @ApiModelProperty({ description: 'icon field', required: false })
    icon: string;

    @ApiModelProperty({ type: ContractDTO, description: 'contract relationship' })
    contract: ContractDTO;

    @ApiModelProperty({ description: 'vehiclesCount field', required: false })
    vehiclesCount: number;

    @ApiModelProperty({ description: 'openingHoursMonday field', required: false })
    @Type(()=> OpenningHours)
    openingHoursMonday: OpenningHours;
    @ApiModelProperty({ description: 'openingHoursTuesday field', required: false })
    @Type(()=> OpenningHours)
    openingHoursTuesday: OpenningHours;
    @ApiModelProperty({ description: 'openingHoursWednesday field', required: false })
    @Type(()=> OpenningHours)
    openingHoursWednesday: OpenningHours;
    @ApiModelProperty({ description: 'openingHoursThursday field', required: false })
    @Type(()=> OpenningHours)
    openingHoursThursday: OpenningHours;
    @ApiModelProperty({ description: 'openingHoursFriday field', required: false })
    @Type(()=> OpenningHours)
    openingHoursFriday: OpenningHours;
    @ApiModelProperty({ description: 'openingHoursSaturday field', required: false })
    @Type(()=> OpenningHours)
    openingHoursSaturday: OpenningHours;
    @ApiModelProperty({ description: 'openingHoursSunday field', required: false })
    @Type(()=> OpenningHours)
    openingHoursSunday: OpenningHours;

    @ApiModelProperty({ description: 'timezone field', required: false })
    timezone: string;
}
