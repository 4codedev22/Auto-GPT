/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Account } from './account.entity';
import { Notification } from './notification.entity';

/**
 * A NotificationAccount.
 */
@Entity('notification_accounts')
export class NotificationAccount extends BaseEntity {
    @Column({ type: 'tinyint', width: 1, name: 'readed', nullable: true })
    readed: boolean;

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    @Index('index_notification_accounts_on_account_id')
    account: Account;

    @ManyToOne(type => Notification)
    @JoinColumn({ name: 'notification_id' })
    @Index('index_notification_accounts_on_notification_id')
    notification: Notification;
}
