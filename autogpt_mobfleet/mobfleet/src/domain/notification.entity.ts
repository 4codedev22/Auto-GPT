/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { NotificationAccount } from './notification-account.entity';

/**
 * A Notification.
 */
@Entity('notifications')
export class Notification extends BaseEntity {
    @Column({ name: 'group', length: 255 })
    group: string;

    @Column({ name: 'title', length: 255 })
    title: string;

    @Column({ name: 'message', type: 'text' })
    message: string;

    @Column({ name: 'image', length: 255, nullable: true })
    image: string;

    @Column({ type: 'tinyint', width: 1, name: 'readed', nullable: true })
    readed: boolean;

    @Column({ name: 'data', type: 'text' })
    data: string;

    @OneToMany(
        type => NotificationAccount,
        other => other.notification,
    )
    notificationAccounts: NotificationAccount[];
}
