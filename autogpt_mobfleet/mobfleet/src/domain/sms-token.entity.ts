/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Account } from './account.entity';

/**
 * A SmsToken.
 */
@Entity('sms_tokens')
export class SmsToken extends BaseEntity {
    @Column({ name: 'token', type: 'text', nullable: true })
    token: string;

    @Column({ type: 'datetime', name: 'expiration', nullable: true })
    expiration: any;

    @Column({ name: 'mode', length: 255, nullable: true })
    mode: string;
    @Column({ name: 'receiver', length: 255, nullable: true })
    receiver: string;

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    @Index('index_sms_tokens_on_account_id')
    account: Account;
}
