/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A RpushApp.
 */
@Entity('rpush_apps')
export class RpushApp extends BaseEntity {
    @Column({ name: 'name', length: 255 })
    name: string;

    @Column({ name: 'environment', length: 255, nullable: true })
    environment: string;

    @Column({ name: 'certificate', type: 'text', nullable: true })
    certificate: string;

    @Column({ name: 'password', length: 255, nullable: true })
    password: string;

    @Column({ type: 'integer', name: 'connections' })
    connections: number;

    @Column({ name: 'type', length: 255 })
    type: string;

    @Column({ name: 'auth_key', length: 255, nullable: true })
    authKey: string;

    @Column({ name: 'client_id', length: 255, nullable: true })
    clientId: string;

    @Column({ name: 'client_secret', length: 255, nullable: true })
    clientSecret: string;

    @Column({ name: 'access_token', length: 255, nullable: true })
    accessToken: string;

    @Column({ type: 'datetime', name: 'access_token_expiration', nullable: true })
    accessTokenExpiration: any;

    @Column({ name: 'apn_key', type: 'text', nullable: true })
    apnKey: string;

    @Column({ name: 'apn_key_id', length: 255, nullable: true })
    apnKeyId: string;

    @Column({ name: 'team_id', length: 255, nullable: true })
    teamId: string;

    @Column({ name: 'bundle_id', length: 255, nullable: true })
    bundleId: string;
}
