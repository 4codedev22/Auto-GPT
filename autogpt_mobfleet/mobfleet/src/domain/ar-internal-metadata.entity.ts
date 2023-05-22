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
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A ArInternalMetadata.
 */
@Entity('ar_internal_metadata')
export class ArInternalMetadata {
    @PrimaryGeneratedColumn({ name: 'key' })
    key: string;

    @Column({ name: 'value', length: 255, nullable: true })
    value: string;

    @CreateDateColumn({ nullable: true, name: 'created_at', type: 'datetime' })
    createdAt?: any;

    @UpdateDateColumn({ nullable: true, name: 'updated_at', type: 'datetime' })
    updatedAt?: any;
}
