/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Command } from './command.entity';
import { Vehicle } from './vehicle.entity';
import { Account } from './account.entity';
import { CommandStatus } from './enumeration/command-status';

/**
 * A CommandLog.
 */
@Entity('command_logs')
export class CommandLog extends BaseEntity {
    @Column({ name: 'job_identifier', length: 255 })
    jobIdentifier: string;

    @Column({ name: 'status', type: 'enum', nullable: true, enum: CommandStatus })
    status: CommandStatus;

    @Column({ type: 'datetime', name: 'executed_at' })
    executedAt: any;

    @ManyToOne(type => Command)
    @JoinColumn({ name: 'command_id' })
    command: Command;

    @ManyToOne(type => Vehicle)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;
}
