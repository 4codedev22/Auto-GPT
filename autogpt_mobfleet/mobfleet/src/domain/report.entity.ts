/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Generated } from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Account } from './account.entity';


/**
 * A Report.
 */
@Entity('reports')
export class Report extends BaseEntity {


    @Column({ name: "uuid", unique: true })
    @Generated('uuid')
    uuid: string;


    @Column({ type: "text", name: "file_name", nullable: true })
    fileName: string;


    @Column({ name: "entity_name" })
    entityName: string;

    @Column({ type: 'tinyint', width: 1, name: "is_empty", nullable: true })
    isEmpty: boolean;


    @Column({ type: 'text', name: "url", nullable: true })
    url: string;


    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
