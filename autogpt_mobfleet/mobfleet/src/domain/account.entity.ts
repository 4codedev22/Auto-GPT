/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from './base/base.entity';
import { Damage } from './damage.entity';
import { FeedbackComment } from './feedback-comment.entity';
import { Contract } from './contract.entity';
import { Role } from './role.entity';
import { Checklist } from './checklist.entity';
import { CommandLog } from './command-log.entity';
import { Feedback } from './feedback.entity';
import { Maintenance } from './maintenance.entity';
import { NotificationAccount } from './notification-account.entity';
import { ReservationAccount } from './reservation-account.entity';
import { Reservation } from './reservation.entity';
import { SmsToken } from './sms-token.entity';
import { VehicleStatusLog } from './vehicle-status-log.entity';
import { VehicleGroup } from './vehicle-group.entity';
import { RpushFeedback } from './rpush-feedback.entity';
import { CnhSituation } from './enumeration/cnh-situation';
import { RegisterSituation } from './enumeration/register-situation';

/**
 * A Accounts.
 */
@Entity('accounts')
export class Account extends BaseEntity {
  @Index('accounts_name_index')
  @Column({ name: 'name', length: 320, nullable: true })
  name: string;

  @Index('accounts_email_index')
  @Column({ name: 'email', length: 320, nullable: true })
  email: string;

  @Column({ name: 'registration', length: 255, nullable: true })
  registration: string;

  @Column({ type: 'date', name: 'admission_date', nullable: true })
  admissionDate: any;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'password_digest', length: 255, nullable: true, select: false })
  passwordDigest: string;

  @Column({ name: 'signature_image', type:"text", nullable: true })
  signatureImage: string;

  @Column({ type: 'tinyint', width: 1, name: 'active', nullable: true })
  active: boolean;

  @Index('accounts_cell_phone_index')
  @Column({ name: 'cell_phone', length: 20, nullable: true })
  cellPhone: string;

  @Column({ type: 'integer', name: 'rpush_feedback_id', nullable: true })
  rpushFeedbackId: number;

  @Column({ name: 'hint', length: 255, nullable: true })
  hint: string;

  @Column({ type: 'tinyint', width: 1, name: 'exec_commands', nullable: true })
  execCommands: boolean;

  @Column({ type: 'tinyint', width: 1, name: 'blocked', nullable: true })
  blocked: boolean;

  @Column({ name: 'employer', length: 255, nullable: true })
  employer: string;

  @Column({ type: 'integer', name: 'push_configuration', nullable: true })
  pushConfiguration: number;

  @Column({ type: 'float', name: 'distance_traveled' })
  distanceTraveled: number;

  @Column({ name: 'display_language', length: 10, nullable: true })
  displayLanguage: string;

  @Column({ name: 'feature_flags', nullable: true })
  featureFlags: string;

  @Column({ name: 'blocked_reason', length: 255, nullable: true })
  blockedReason: string;

  @Index('accounts_blocked_by_index')
  @Column({ type: 'bigint', name: 'blocked_by', nullable: true })
  blockedBy: number;

  @Column({ type: 'datetime', name: 'blocked_at', nullable: true })
  blockedAt: any;

  @Column({ name: 'deleted_reason', length: 255, nullable: true })
  deletedReason: string;

  @Column({ type: 'datetime', name: 'deleted_at', nullable: true })
  deletedAt: any;

  @Index('accounts_deleted_by_index')
  @Column({ type: 'bigint', name: 'deleted_by', nullable: true })
  deletedBy: number;

  @Column({ name: 'address_zip_code', length: 20, nullable: true })
  addressZipCode: string;
  @Column({ name: 'address_public_place', length: 255, nullable: true })
  addressPublicPlace: string;
  @Column({ name: 'address_number', length: 20, nullable: true })
  addressNumber: string;
  @Column({ name: 'address_street', length: 255, nullable: true })
  addressStreet: string;
  @Column({ name: 'address_complement', length: 255, nullable: true })
  addressComplement: string;
  @Column({ name: 'address_city', length: 255, nullable: true })
  addressCity: string;
  @Column({ name: 'address_state', length: 20, nullable: true })
  addressState: string;

  @Column({ type: 'date', name: 'cnh_expiration_date', nullable: true })
  cnhExpirationDate: any;

  @Column({ name: 'cnh_situation', type: 'enum', nullable: true, enum: CnhSituation })
  cnhSituation: CnhSituation;



  @Column({ name: 'register_situation', type: 'enum', nullable: true, enum: RegisterSituation })
  registerSituation: RegisterSituation;

  @Column({ name: 'analized_by', length: 255, nullable: true })
  analizedBy: string;

  @Column({ type: 'datetime', name: 'analized_at', nullable: true })
  analizedAt: any;

  @Column({ name: 'cnh_iamge', type: 'text', nullable: true })
  cnhImage: string;

  @Column({ name: 'profile_iamge', type: 'text', nullable: true })
  profileImage: string;

  @Column({ name: 'proof_of_residence_image', type: 'text', nullable: true })
  proofOfResidenceImage: string;

  @Column({ name: 'customer_id', length: 255, nullable: true })
  customerId: string;

  @OneToMany(
    type => Damage,
    other => other.account,
  )
  damages: Damage[];

  @OneToMany(
    type => FeedbackComment,
    other => other.account,
  )
  feedbackComments: FeedbackComment[];

  @ManyToMany(
    type => Contract,
    contract => contract.accounts,
  )
  @JoinTable({
    name: 'accounts_contracts',
    joinColumn: { name: 'account_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contract_id', referencedColumnName: 'id' },
  })
  contracts: Contract[];

  @ManyToMany(type => VehicleGroup, other => other.accounts)
  @JoinTable({
    name: 'accounts_vehicle_groups',
    joinColumn: { name: 'account_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'vehicle_group_id', referencedColumnName: 'id' },
  })
  vehicleGroups: VehicleGroup[];

  @ManyToMany(type => Role)
  @JoinTable({
    name: 'accounts_roles',
    joinColumn: { name: 'account_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(
    type => Checklist,
    other => other.account,
  )
  checklists: Checklist[];

  @OneToMany(
    type => CommandLog,
    other => other.account,
  )
  commandLogs: CommandLog[];

  @OneToMany(
    type => Feedback,
    other => other.account,
  )
  feedbacks: Feedback[];

  @OneToMany(
    type => Maintenance,
    other => other.account,
  )
  maintenances: Maintenance[];

  @OneToMany(
    type => NotificationAccount,
    other => other.account,
  )
  notificationAccounts: NotificationAccount[];

  @OneToMany(
    type => ReservationAccount,
    other => other.account,
  )
  reservationAccounts: ReservationAccount[];

  @OneToMany(
    type => Reservation,
    other => other.account,
  )
  reservations: Reservation[];

  @OneToMany(
    type => SmsToken,
    other => other.account,
  )
  smsTokens: SmsToken[];

  @OneToMany(
    type => VehicleStatusLog,
    other => other.createdBy,
  )
  vehicleStatusLogs: VehicleStatusLog[];

  qtyTravels: number;

  @ManyToOne(type => RpushFeedback, { nullable: true })
  @JoinColumn({ name: 'rpush_feedback_id' })
  rpushFeedback: RpushFeedback;
}
