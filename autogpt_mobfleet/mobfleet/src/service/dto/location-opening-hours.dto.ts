/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OpenningHours } from '../../domain/openning-hours.entity';
import { BaseDTO } from './base.dto';

export class LocationOpeningHoursDTO {
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
}
