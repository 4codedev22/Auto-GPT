/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Contract } from './contract.entity';
import { CommandLog } from './command-log.entity';
import { AvailableCommands } from './enumeration/available-commands';

/**
 * A Command.
 */
@Entity('commands')
export class Command extends BaseEntity {
    @Column({ type: 'integer', name: 'command_code' })
    commandCode: number;

    @Column({ name: 'name', type: 'enum', nullable: false, enum: AvailableCommands, unique: true })
    name: AvailableCommands;

    @Column({ type: 'integer', name: 'ttl' })
    ttl: number;

    @ManyToMany(type => Contract)
    @JoinTable({
        name: 'commands_contracts',
        joinColumn: { name: 'command_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'contract_id', referencedColumnName: 'id' },
    })
    contracts: Contract[];

    @OneToMany(
        type => CommandLog,
        other => other.command,
    )
    commandLogs: CommandLog[];
}
