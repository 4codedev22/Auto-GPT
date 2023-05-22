/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Config.
 */
@Entity('configs')
@Index(['name', 'companyId'])
@Index(['name', 'contractId'])
export class Config extends BaseEntity {
    @Column({ type: 'bigint', name: 'contract_id', nullable: true })
    contractId: number;

    @Column({ type: 'bigint', name: 'company_id', nullable: true })
    companyId: number;

    @Column({ name: 'name', length: 320, nullable: true })
    name: string;

    @Column({ name: 'value', type: 'text', nullable: true })
    value: string;
}
