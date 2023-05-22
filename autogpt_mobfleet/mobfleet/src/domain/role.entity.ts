/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Account } from './account.entity';

/**
 * A Role.
 */
@Entity('roles')
@Index(['authorizableType', 'authorizableId'])
export class Role extends BaseEntity {
    @Column({ name: 'name', length: 255 })
    @Index('index_roles_on_name')
    name: string;

    @Column({ name: 'authorizable_type', length: 255, nullable: true })
    authorizableType: string;

    @Column({ type: 'bigint', name: 'authorizable_id', nullable: true })
    authorizableId: number;

    @Column({ type: 'tinyint', width: 1, name: 'system', default: 0 })
    system: boolean;

    @Column({ name: 'default_flags', type: 'json', nullable: true })
    defaultFlags: string;

    @ManyToMany(type => Account)
    accounts: Account[];
}
