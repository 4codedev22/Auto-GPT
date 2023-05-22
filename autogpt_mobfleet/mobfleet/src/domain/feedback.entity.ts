/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { FeedbackComment } from './feedback-comment.entity';
import { Account } from './account.entity';

/**
 * A Feedback.
 */
@Entity('feedbacks')
export class Feedback extends BaseEntity {
    @Column({ name: 'device_model', length: 255, nullable: true })
    deviceModel: string;

    @Column({ name: 'os_version', length: 255, nullable: true })
    osVersion: string;

    @Column({ name: 'app_version', length: 255, nullable: true })
    appVersion: string;

    @Column({ name: 'message', length: 255, nullable: true })
    message: string;

    @Column({ name: 'pin', length: 255 })
    pin: string;

    @OneToMany(
        type => FeedbackComment,
        other => other.feedback,
    )
    feedbackComments: FeedbackComment[];

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;
}
