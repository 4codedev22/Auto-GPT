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
    UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A RpushFeedback.
 */
@Entity('rpush_feedback')
export class RpushFeedback extends BaseEntity {
    @Column({ name: 'device_token', length: 255, nullable: true })
    @Index('index_rpush_feedback_on_device_token')
    deviceToken: string;

    @UpdateDateColumn({ nullable: true, name: 'failed_at', type: 'datetime' })
    failedAt: any;

    @Column({ type: 'integer', name: 'app_id', nullable: true })
    appId: number;
}
