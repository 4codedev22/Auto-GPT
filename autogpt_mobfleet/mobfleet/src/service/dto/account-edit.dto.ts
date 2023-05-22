/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches, IsOptional, IsDate } from 'class-validator';
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
import { Exclude, Type } from 'class-transformer';
import { VehicleGroupDTO } from './vehicle-group.dto';
import { CnhSituation } from '../../domain/enumeration/cnh-situation';
import { RegisterSituation } from '../../domain/enumeration/register-situation';
import { OnlyNumbers } from './dto-utils';

/**
 * A AccountsDTO object.
 */
export class AccountEditDTO {
  @IsOptional()
  @MaxLength(320)
  @ApiModelProperty({ description: 'name field', required: false })
  name: string;

  @IsOptional()
  @MaxLength(320)
  @ApiModelProperty({ description: 'email field', required: false })
  email: string;

  @IsOptional()
  @MaxLength(320)
  @ApiModelProperty({ description: 'registration field', required: false })
  registration: string;

  @IsOptional()
  @ApiModelProperty({ description: 'admissionDate field', required: false })
  admissionDate?: any;

  @OnlyNumbers({ toClassOnly: true })
  @IsOptional()
  @MaxLength(20)
  @ApiModelProperty({ description: 'cellPhone field', required: false })
  cellPhone?: string;

  @IsOptional()
  @MaxLength(10)
  @ApiModelProperty({ description: 'displayLanguage field', required: false })
  displayLanguage?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'user roles field', required: false })
  roles?: string[];

  @IsOptional()
  @ApiModelProperty({ description: 'contracts field', required: false })
  contracts?: number[];

  @IsOptional()
  @ApiModelProperty({ description: 'vehicleGroups field', required: false })
  vehicleGroups?: number[];
  @IsOptional()
  @ApiModelProperty({ description: 'address_zip_code field', required: false })
  addressZipCode: string;
  @IsOptional()
  @ApiModelProperty({ description: 'address_public_place field', required: false })
  addressPublicPlace: string;
  @IsOptional()
  @ApiModelProperty({ description: 'address_number field', required: false })
  addressNumber: string;
  @IsOptional()
  @ApiModelProperty({ description: 'address_street field', required: false })
  addressStreet: string;
  @IsOptional()
  @ApiModelProperty({ description: 'address_complement field', required: false })
  addressComplement: string;
  @IsOptional()
  @ApiModelProperty({ description: 'address_city field', required: false })
  addressCity: string;
  @IsOptional()
  @ApiModelProperty({ description: 'address_state field', required: false })
  addressState: string;
  @IsOptional()
  @ApiModelProperty({ description: 'cnhExpirationDate field' })
  cnhExpirationDate: any;
  @IsOptional()
  @ApiModelProperty({ type: CnhSituation, description: 'cnhSituation field' })
  cnhSituation: CnhSituation;
  @IsOptional()
  @ApiModelProperty({ description: 'registerSituation field', type: RegisterSituation })
  registerSituation: RegisterSituation;
  @IsOptional()
  @ApiModelProperty({ description: 'analizedBy field' })
  analizedBy: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiModelProperty({ description: 'analizedAt field', required: false })
  analizedAt: Date;

}
