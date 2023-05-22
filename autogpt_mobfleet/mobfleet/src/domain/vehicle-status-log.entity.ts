/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Vehicle } from './vehicle.entity';
import { Account } from './account.entity';
import { VehicleStatus } from './enumeration/vehicle-status';

/**
 * A VehicleStatusLog.
 */
@Entity('vehicle_status_log')
export class VehicleStatusLog extends BaseEntity {
  //  @Column({ type: 'integer', name: 'status', nullable: true })
  @Column({ name: 'status', type: 'enum', nullable: true, enum: VehicleStatus })
  @Index('vehicle_status_log_status_index')
  status: VehicleStatus;


  @ManyToOne(type => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(type => Account)
  @JoinColumn({ name: 'created_by' })
  @Index('vehicle_status_log_created_by_index')
  createdBy: Account;

  @Column({ type: 'text', name: 'reason', nullable: true })
  reason: string;
}
