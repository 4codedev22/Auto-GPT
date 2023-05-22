/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional, IsDate } from 'class-validator';
import { Exclude, Type } from 'class-transformer';

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
import { VehicleGroupDTO } from './vehicle-group.dto';
import { RpushFeedbackDTO } from './rpush-feedback.dto';
import { CnhSituation } from '../../domain/enumeration/cnh-situation';
import { RegisterSituation } from '../../domain/enumeration/register-situation';
import { OnlyNumbers } from './dto-utils';

/**
 * A AccountsDTO object.
 */
export class AccountDTO extends BaseDTO {
  @MaxLength(320)
  @ApiModelProperty({ description: 'name field', required: false })
  name: string;

  @MaxLength(320)
  @ApiModelProperty({ description: 'email field', required: false })
  email: string;

  @MaxLength(255)
  @ApiModelProperty({ description: 'registration field', required: false })
  registration: string;

  @ApiModelProperty({ description: 'admissionDate field', required: false })
  admissionDate: any;

  @ApiModelProperty({ description: 'signatureImage field', required: false })
  signatureImage: string;


  @Exclude({ toPlainOnly: true })
  @MaxLength(255)
  @ApiModelProperty({ description: 'passwordDigest field', required: false })
  passwordDigest: string;

  @ApiModelProperty({ description: 'active field', required: false })
  active: boolean;

  @OnlyNumbers({ toClassOnly: true })
  @MaxLength(20)
  @ApiModelProperty({ description: 'cellPhone field', required: false })
  cellPhone: string;

  @ApiModelProperty({ description: 'rpushFeedbackId field', required: false })
  rpushFeedbackId: number;

  @MaxLength(255)
  @ApiModelProperty({ description: 'hint field', required: false })
  hint: string;

  @ApiModelProperty({ description: 'execCommands field', required: false })
  execCommands: boolean;

  @ApiModelProperty({ description: 'blocked field', required: false })
  blocked: boolean;

  @MaxLength(255)
  @ApiModelProperty({ description: 'employer field', required: false })
  employer: string;

  @ApiModelProperty({ description: 'pushConfiguration field', required: false })
  pushConfiguration: number;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'distanceTraveled field' })
  distanceTraveled: number;

  @MaxLength(10)
  @ApiModelProperty({ description: 'displayLanguage field', required: false })
  displayLanguage: string;

  @ApiModelProperty({ description: 'featureFlags field', required: false })
  featureFlags: string;

  @MaxLength(255)
  @ApiModelProperty({ description: 'blockedReason field', required: false })
  blockedReason: string;

  @ApiModelProperty({ description: 'blockedBy field', required: false })
  blockedBy: number;

  @ApiModelProperty({ description: 'blockedAt field', required: false })
  blockedAt: any;

  @MaxLength(255)
  @ApiModelProperty({ description: 'deletedReason field', required: false })
  deletedReason: string;

  @ApiModelProperty({ description: 'deletedAt field', required: false })
  deletedAt: any;

  @ApiModelProperty({ description: 'deletedBy field', required: false })
  deletedBy: number;

  @ApiModelProperty({ description: 'address_zip_code field', required: false })
  addressZipCode: string;
  @ApiModelProperty({ description: 'address_public_place field', required: false })
  addressPublicPlace: string;
  @ApiModelProperty({ description: 'address_number field', required: false })
  addressNumber: string;
  @ApiModelProperty({ description: 'address_street field', required: false })
  addressStreet: string;
  @ApiModelProperty({ description: 'address_complement field', required: false })
  addressComplement: string;
  @ApiModelProperty({ description: 'address_city field', required: false })
  addressCity: string;
  @ApiModelProperty({ description: 'address_state field', required: false })
  addressState: string;

  @ApiModelProperty({ description: 'cnh_iamge', required: false })
  cnhImage: string;
  @ApiModelProperty({ description: 'profile_iamge', required: false })
  profileImage: string;
  @ApiModelProperty({ description: 'proof_of_residence_image', required: false })
  proofOfResidenceImage: string;

  @ApiModelProperty({ type: DamageDTO, isArray: true, description: 'damages relationship' })
  damages: DamageDTO[];

  @ApiModelProperty({ type: FeedbackCommentDTO, isArray: true, description: 'feedbackComments relationship' })
  feedbackComments: FeedbackCommentDTO[];

  @ApiModelProperty({ type: ContractDTO, isArray: true, description: 'contracts relationship' })
  @Type(() => ContractDTO)
  contracts: ContractDTO[];

  @ApiModelProperty({ type: RoleDTO, isArray: true, description: 'roles relationship' })
  roles: RoleDTO[];

  @ApiModelProperty({ type: ChecklistDTO, isArray: true, description: 'checklists relationship' })
  checklists: ChecklistDTO[];

  @ApiModelProperty({ type: CommandLogDTO, isArray: true, description: 'commandLogs relationship' })
  commandLogs: CommandLogDTO[];

  @ApiModelProperty({ type: FeedbackDTO, isArray: true, description: 'feedbacks relationship' })
  feedbacks: FeedbackDTO[];

  @ApiModelProperty({ type: MaintenanceDTO, isArray: true, description: 'maintenances relationship' })
  maintenances: MaintenanceDTO[];

  @ApiModelProperty({ type: NotificationAccountDTO, isArray: true, description: 'notificationAccounts relationship' })
  notificationAccounts: NotificationAccountDTO[];

  @ApiModelProperty({ type: ReservationAccountDTO, isArray: true, description: 'reservationAccounts relationship' })
  reservationAccounts: ReservationAccountDTO[];

  @ApiModelProperty({ type: ReservationDTO, isArray: true, description: 'reservations relationship' })
  reservations: ReservationDTO[];

  @ApiModelProperty({ type: VehicleGroupDTO, isArray: true, description: 'vehicleGroups relationship' })
  vehicleGroups: VehicleGroupDTO[];

  @ApiModelProperty({ type: SmsTokenDTO, isArray: true, description: 'smsTokens relationship' })
  smsTokens: SmsTokenDTO[];

  @ApiModelProperty({ type: VehicleStatusLogDTO, isArray: true, description: 'vehicleStatusLogs relationship' })
  vehicleStatusLogs: VehicleStatusLogDTO[];

  @ApiModelProperty({ description: 'cnhExpirationDate field' })
  cnhExpirationDate: any;

  @ApiModelProperty({ type: CnhSituation, description: 'cnhSituation field' })
  cnhSituation: CnhSituation;

  @ApiModelProperty({ description: 'registerSituation field', type: RegisterSituation })
  registerSituation: RegisterSituation;

  @ApiModelProperty({ description: 'analizedBy field' })
  analizedBy: string;

  @IsOptional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'Customer ID field' })
  customerId: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiModelProperty({ description: 'analizedAt field', required: false })
  analizedAt: Date;

  @ApiModelProperty({ description: 'qtyTravels field', required: false })
  qtyTravels: number;

  @ApiModelProperty({ type: RpushFeedbackDTO, description: 'rpush feedback relationship', required: false })
  rpushFeedback: RpushFeedbackDTO;
}
