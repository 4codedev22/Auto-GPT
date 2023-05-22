/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches, IsOptional } from 'class-validator';
import { BaseDTO } from './base.dto';

import { DamageDTO } from './damage.dto';
import { FeedbackCommentDTO } from './feedback-comment.dto';
import { ContractDTO } from './contract.dto';
import { RoleDTO } from './role.dto';
import { ChecklistDTO } from './checklist.dto';
import { CommandLogDTO } from './command-log.dto';
import { FeedbackDTO } from './feedback.dto';
import { MaintenanceDTO } from './maintenance.dto';
import { NotificationAccountDTO } from './notification-account.dto';
import { ReservationAccountDTO } from './reservation-account.dto';
import { ReservationDTO } from './reservation.dto';
import { SmsTokenDTO } from './sms-token.dto';
import { VehicleStatusLogDTO } from './vehicle-status-log.dto';
import { OnlyNumbers } from './dto-utils';

/**
 * A AccountsDTO object.
 */
export class AccountV1DTO {
    @MaxLength(320)
    @ApiModelProperty({ description: 'name field', required: false })
    name: string;

    @MaxLength(320)
    @ApiModelProperty({ description: 'email field', required: false })
    email: string;

    @MaxLength(320)
    @ApiModelProperty({ description: 'registration field', required: false })
    registration: string;

    @IsOptional()
    @ApiModelProperty({ description: 'admissionDate field', required: false })
    admission_date: any;

    @OnlyNumbers({ toClassOnly: true })
    @MaxLength(20)
    @ApiModelProperty({ description: 'cellPhone field', required: false })
    cell_phone: string;

    @ApiModelProperty({ description: 'user roles field', required: false })
    roles: string[];

    @ApiModelProperty({ description: 'contracts field', required: false })
    contracts: number[];

    @MaxLength(10)
    @ApiModelProperty({ description: 'displayLanguage field', required: false })
    displayLanguage: string;
}
