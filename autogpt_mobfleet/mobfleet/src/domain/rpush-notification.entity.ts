/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A RpushNotification.
 */
@Entity('rpush_notifications')
@Index(['delivered', 'failed', 'processing', 'deliverAfter', 'createdAt'])
export class RpushNotification extends BaseEntity {
    @Column({ type: 'integer', name: 'badge', nullable: true })
    badge: number;

    @Column({ name: 'device_token', length: 255, nullable: true })
    deviceToken: string;

    @Column({ name: 'sound', length: 255, nullable: true })
    sound: string;

    @Column({ name: 'alert', type: 'text', nullable: true })
    alert: string;

    @Column({ name: 'data', type: 'text', nullable: true })
    data: string;

    @Column({ type: 'integer', name: 'expiry', nullable: true, default: 86400 })
    expiry: number;

    @Column({ type: 'tinyint', width: 1, default: 0, name: 'delivered' })
    delivered: boolean;

    @Column({ type: 'datetime', name: 'delivered_at', nullable: true })
    deliveredAt: any;

    @Column({ type: 'tinyint', width: 1, default: 0, name: 'failed' })
    failed: boolean;

    @Column({ type: 'datetime', name: 'failed_at', nullable: true })
    failedAt: any;

    @Column({ type: 'integer', name: 'error_code', nullable: true })
    errorCode: number;

    @Column({ name: 'error_description', type: 'text', nullable: true })
    errorDescription: string;

    @Column({ type: 'datetime', name: 'deliver_after', nullable: true })
    deliverAfter: any;

    @Column({ type: 'tinyint', width: 1, default: 0, name: 'alert_is_json' })
    alertIsJson: boolean;

    @Column({ name: 'type', length: 255 })
    type: string;

    @Column({ name: 'collapse_key', length: 255, nullable: true })
    collapseKey: string;

    @Column({ type: 'tinyint', width: 1, default: 0, name: 'delay_while_idle' })
    delayWhileIdle: boolean;

    @Column({ type: 'mediumtext', name: 'registration_ids', nullable: true })
    registrationIds: string;

    @Column({ type: 'integer', name: 'app_id' })
    appId: number;

    @Column({ type: 'integer', name: 'retries', nullable: true })
    retries: number;

    @Column({ name: 'uri', length: 255, nullable: true })
    uri: string;

    @Column({ type: 'datetime', name: 'fail_after', nullable: true })
    failAfter: any;

    @Column({ type: 'tinyint', width: 1, default: 0, name: 'processing' })
    processing: boolean;

    @Column({ type: 'integer', name: 'priority', nullable: true })
    priority: number;

    @Column({ name: 'url_args', length: 255, nullable: true })
    urlArgs: string;

    @Column({ name: 'category', length: 255, nullable: true })
    category: string;

    @Column({ type: 'tinyint', width: 1, default: 0, name: 'content_available' })
    contentAvailable: boolean;

    @Column({ name: 'notification', type: 'text', nullable: true })
    notification: string;

    @Column({ type: 'tinyint', width: 1, default: 0, name: 'mutable_content' })
    mutableContent: boolean;

    @Column({ name: 'external_device_id', length: 255, nullable: true })
    externalDeviceId: string;

    @Column({ name: 'thread_id', length: 255, nullable: true })
    threadId: string;
}
