/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Entity,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    Index,
    Generated,
} from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Company } from './company.entity';
import { VehicleGroup } from './vehicle-group.entity';
import { Location } from './location.entity';
import { Account } from './account.entity';
import { Command } from './command.entity';
import { Damage } from './damage.entity';
import { Vehicle } from './vehicle.entity';
import { ContractStatus } from './enumeration/contract-status';
import { Exclude } from 'class-transformer';

/**
 * A Contract.
 */
@Entity('contracts')
export class Contract extends BaseEntity {
    @Column({ name: 'uuid', type: 'uuid', length: 36, unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ name: 'name', length: 255 })
    @Index('contracts_name_index')
    name: string;

    @Column({ name: 'support_phone', length: 255, nullable: true })
    supportPhone: string;
    @Column({ name: 'support_email', length: 255, nullable: true })
    supportEmail: string;
    @Column({ name: 'support_whatsapp_number', length: 255, nullable: true })
    supportWhatsappNumber: string;

    @Column({ name: 'status', type: 'enum', nullable: true, enum: ContractStatus })
    status: ContractStatus;

    @Exclude({ toPlainOnly: true })
    @Column({ name: 'client_token', type: 'text', nullable: true })
    clientToken: string;

    @Exclude({ toPlainOnly: true })
    @Column({ name: 'secret_token', type: 'text', nullable: true })
    secretToken: string;

    @ManyToOne(type => Company)
    @JoinColumn({ name: 'company_id' })
    @Index('index_contracts_on_company_id')
    company: Company;

    @ManyToMany(
        type => VehicleGroup,
        other => other.contracts,
    )
    @JoinTable({
        name: 'contracts_vehicle_groups',
        joinColumn: { name: 'contract_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'vehicle_group_id', referencedColumnName: 'id' },
    })
    vehicleGroups: VehicleGroup[];

    @OneToMany(
        type => Location,
        other => other.contract,
    )
    locations: Location[];

    @ManyToMany(
        type => Account,
        account => account?.contracts,
    )
    accounts: Account[];

    @ManyToMany(
        type => Command,
        command => command?.contracts,
    )
    commands: Command[];

    @ManyToMany(type => Damage)
    damages: Damage[];

    @OneToMany(
        type => Vehicle,
        other => other.contract,
    )
    vehicles: Vehicle[];
}
