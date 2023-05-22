/* eslint-disable @typescript-eslint/no-unused-vars */
import { Exclude } from 'class-transformer';
import { Entity, Column, OneToMany, Index, Generated } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Contract } from './contract.entity';

/**
 * A Company.
 */
@Entity('companies')
export class Company extends BaseEntity {
    @Column({ name: 'uuid', length: 36, unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ name: 'name', length: 255 })
    @Index('companies_name_index')
    name: string;

    @Column({ name: 'payment_enabled', default: false })
    paymentEnabled: boolean;

    @Exclude()
    @Column({ name: 'payment_descriptor', length: 22,  nullable: true })
    paymentDescriptor: string;

    @Exclude()
    @Column({ name: 'payment_public_key', length: 255,  nullable: true })
    paymentPublicKey: string;

    @Exclude()
    @Column({ name: 'payment_secret_key', length: 255,  nullable: true })
    paymentSecretKey: string;

    @OneToMany(
        type => Contract,
        other => other.company,
    )
    contracts: Contract[];
}
