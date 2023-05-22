/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Account } from './account.entity';
import { Feedback } from './feedback.entity';

/**
 * A FeedbackComment.
 */
@Entity('feedback_comments')
export class FeedbackComment extends BaseEntity {
    @Column({ name: 'response', length: 500 })
    response: string;

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    @Index('index_feedbacks_on_account_id')
    account: Account;

    @ManyToOne(type => Feedback)
    @JoinColumn({ name: 'feedback_id' })
    feedback: Feedback;
}
